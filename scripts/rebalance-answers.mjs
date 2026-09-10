/**
 * Rebalances quiz answer positions using TypeScript AST parsing.
 * Options are shuffled per-question (deterministically by question id),
 * and correctIndices are updated to match the new positions.
 */
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

// --- Seeded deterministic RNG (LCG) ---
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223;
    s >>>= 0;
    return s / 0x100000000;
  };
}

function strToSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
    h >>>= 0;
  }
  return h;
}

function shuffleWithRng(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- AST helpers ---
function getStringValue(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function getNumericValue(node) {
  if (ts.isNumericLiteral(node)) return parseInt(node.text, 10);
  // Unary minus (negative number — shouldn't occur here but be safe)
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -parseInt(node.operand.text, 10);
  }
  return null;
}

// Walk an ObjectLiteralExpression representing a QuizQuestion and return
// { idNode, optionsNode, correctIndicesNode } — all PropertyAssignment nodes.
function extractQuestionNodes(objNode) {
  let idNode = null;
  let optionsNode = null;
  let correctIndicesNode = null;
  for (const prop of objNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const name = prop.name.text ?? prop.name.escapedText;
    if (name === "id") idNode = prop;
    else if (name === "options") optionsNode = prop;
    else if (name === "correctIndices") correctIndicesNode = prop;
  }
  return { idNode, optionsNode, correctIndicesNode };
}

// --- Main rebalance logic ---
function rebalanceFile(filePath) {
  const source = readFileSync(filePath, "utf8");

  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  // Collect all edits as { start, end, replacement } — apply in reverse order
  const edits = [];
  let changeCount = 0;

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const { idNode, optionsNode, correctIndicesNode } =
        extractQuestionNodes(node);

      if (idNode && optionsNode && correctIndicesNode) {
        const idVal = getStringValue(idNode.initializer);
        if (!idVal) return ts.forEachChild(node, visit);

        // Parse options
        const optionsArr = optionsNode.initializer;
        if (!ts.isArrayLiteralExpression(optionsArr))
          return ts.forEachChild(node, visit);
        const options = optionsArr.elements.map(getStringValue);
        if (options.some((o) => o === null))
          return ts.forEachChild(node, visit);

        // Parse correctIndices
        const ciArr = correctIndicesNode.initializer;
        if (!ts.isArrayLiteralExpression(ciArr))
          return ts.forEachChild(node, visit);
        const correctIndices = ciArr.elements.map(getNumericValue);
        if (correctIndices.some((n) => n === null))
          return ts.forEachChild(node, visit);

        // Compute shuffled order
        const rng = makeRng(strToSeed(idVal));
        const newOrder = shuffleWithRng([...Array(options.length).keys()], rng);
        const newOptions = newOrder.map((i) => options[i]);
        const newCorrectIndices = correctIndices
          .map((oldIdx) => newOrder.indexOf(oldIdx))
          .sort((a, b) => a - b);

        // Detect quote style from first option element
        const firstElem = optionsArr.elements[0];
        const quote =
          firstElem && source[firstElem.getStart(sf)] === "'" ? "'" : '"';

        // Build replacement for the options array
        const optIndent = detectIndent(source, optionsArr.getStart(sf));
        const elemIndent = optIndent + "  ";

        const newOptionsText =
          "[\n" +
          newOptions
            .map(
              (o) =>
                `${elemIndent}${quote}${escapeForQuote(o, quote)}${quote},`,
            )
            .join("\n") +
          "\n" +
          optIndent +
          "]";

        edits.push({
          start: optionsArr.getStart(sf),
          end: optionsArr.getEnd(),
          replacement: newOptionsText,
        });

        // Build replacement for correctIndices array
        const newCiText = "[" + newCorrectIndices.join(", ") + "]";
        edits.push({
          start: ciArr.getStart(sf),
          end: ciArr.getEnd(),
          replacement: newCiText,
        });

        changeCount++;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);

  // Apply edits in reverse order (so positions stay valid)
  edits.sort((a, b) => b.start - a.start);
  let result = source;
  for (const { start, end, replacement } of edits) {
    result = result.slice(0, start) + replacement + result.slice(end);
  }

  return { result, changeCount };
}

function detectIndent(source, pos) {
  // Walk back to the start of the line
  let i = pos - 1;
  while (i >= 0 && source[i] !== "\n") i--;
  const lineStart = i + 1;
  const spaces = source.slice(lineStart, pos).match(/^(\s*)/)[1];
  return spaces;
}

function escapeForQuote(str, quote) {
  if (quote === '"') return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// --- Distribution report ---
function reportDistribution(content, label) {
  const counts = {};
  let total = 0;
  for (const m of content.matchAll(/correctIndices:\s*\[([^\]]+)\]/g)) {
    for (const n of m[1].split(",").map((s) => parseInt(s.trim()))) {
      if (!isNaN(n)) {
        counts[n] = (counts[n] || 0) + 1;
        total++;
      }
    }
  }
  console.log(`\n${label}`);
  Object.keys(counts)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((k) => {
      const pct = ((counts[k] / total) * 100).toFixed(1);
      const bar = "#".repeat(Math.round((counts[k] / total) * 20));
      console.log(
        `  [${k}] ${String(counts[k]).padStart(3)} (${pct.padStart(5)}%)  ${bar}`,
      );
    });
}

// --- Run ---
const files = [
  "src/data/aws/saa/quizQuestions.ts",
  "src/data/aws/aif/quizQuestions.ts",
  "src/data/aws/clf/quizQuestions.ts",
  "src/data/aws/dva/quizQuestions.ts",
  "src/data/aws/mls/quizQuestions.ts",
];

files.forEach((f) => {
  const { result, changeCount } = rebalanceFile(f);
  reportDistribution(result, `${f} (${changeCount} questions)`);
  writeFileSync(f, result, "utf8");
});

console.log("\nDone.");
