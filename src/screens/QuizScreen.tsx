import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
  ROUTE_LINE_WIDTH,
  STATION_DOT_SIZE,
} from "../utils/theme";
import { AbbreviatedText } from "../components/AbbreviatedText";
import {
  QuizQuestion,
  Domain,
  Difficulty,
  UserProgress,
  QuizAttempt,
} from "../types";
import {
  loadProgress,
  saveProgress,
  touchStreak,
  recordWrongAnswers,
  recordMissedQuizQuestion,
} from "../utils/storage";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useActiveData, useActiveStorageKey } from "../context/useActiveData";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";

type Route = RouteProp<RootStackParamList, "Quiz">;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { domain, difficulty, count, service } = route.params;
  const { certMeta } = useCert();
  const activeStorageKey = useActiveStorageKey();
  const { quizQuestions } = useActiveData();
  const { colors } = useTheme();
  const DOMAIN_META = getDomainMeta(colors);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number[] | null)[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const filtered = quizQuestions.filter((q) => {
      const domainMatch = domain === "all" || q.domain === (domain as Domain);
      const diffMatch =
        difficulty === "all" || q.difficulty === (difficulty as Difficulty);
      const serviceMatch = !service || q.service === service;
      return domainMatch && diffMatch && serviceMatch;
    });
    const selected = shuffle(filtered).slice(0, count);
    setQuestions(selected);
    setAnswers(new Array(selected.length).fill(null));
  }, [domain, difficulty, count]);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ = questions[currentIndex];

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (currentQ.type === "single") {
      setSelectedOptions([idx]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
      );
    }
  };

  const handleSubmit = useCallback(async () => {
    if (selectedOptions.length === 0) return;
    setSubmitted(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOptions;
    setAnswers(newAnswers);

    if (currentIndex === questions.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFinished(true);

      let correct = 0;
      const finalAnswers = newAnswers;
      questions.forEach((q, i) => {
        const ans = finalAnswers[i];
        if (!ans) return;
        const sorted = [...ans].sort().join(",");
        const expected = [...q.correctIndices].sort().join(",");
        if (sorted === expected) correct++;
      });

      const progress = await loadProgress(activeStorageKey);
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        domain: domain as Domain | "all",
        score: correct,
        total: questions.length,
        timeSeconds: elapsed,
        questionIds: questions.map((q) => q.id),
      };

      const updatedDomainScores = { ...progress.domainScores };
      const wrongServices: string[] = [];
      questions.forEach((q, i) => {
        const ans = finalAnswers[i];
        if (!ans) return;
        const sorted = [...ans].sort().join(",");
        const expected = [...q.correctIndices].sort().join(",");
        const isCorrect = sorted === expected;
        updatedDomainScores[q.domain] = {
          attempted: updatedDomainScores[q.domain].attempted + 1,
          correct: updatedDomainScores[q.domain].correct + (isCorrect ? 1 : 0),
        };
        if (!isCorrect) wrongServices.push(q.service);
      });

      let withMissed = progress;
      questions.forEach((q, i) => {
        const ans = finalAnswers[i];
        if (!ans) return;
        const sorted = [...ans].sort().join(",");
        const expected = [...q.correctIndices].sort().join(",");
        if (sorted !== expected) {
          const correctLabels = q.correctIndices
            .map((ci) => q.options[ci])
            .join(" / ");
          withMissed = recordMissedQuizQuestion(withMissed, {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndices[0],
            explanation:
              q.type === "multi"
                ? `Correct: ${correctLabels}\n\n${q.explanation}`
                : q.explanation,
            source: q.service,
          });
        }
      });

      const withWeak = recordWrongAnswers(withMissed, wrongServices);
      const updated: UserProgress = touchStreak({
        ...withWeak,
        quizHistory: [attempt, ...progress.quizHistory].slice(0, 50),
        domainScores: updatedDomainScores,
        totalQuestionsAnswered:
          progress.totalQuestionsAnswered + questions.length,
        totalCorrect: progress.totalCorrect + correct,
      });
      await saveProgress(updated, activeStorageKey);
    }
  }, [selectedOptions, answers, currentIndex, questions, domain, elapsed]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptions([]);
      setSubmitted(false);
    }
  };

  const handleQuit = () => {
    const doQuit = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      navigation.goBack();
    };
    if (Platform.OS === "web") {
      if (window.confirm("Quit quiz? Progress will be lost.")) doQuit();
    } else {
      Alert.alert(
        "Quit Quiz",
        "Are you sure you want to quit? Progress will be lost.",
        [
          { text: "Continue", style: "cancel" },
          { text: "Quit", style: "destructive", onPress: doQuit },
        ],
      );
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const styles = makeStyles(colors);

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Loading questions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQ) return null;

  const meta = DOMAIN_META[currentQ.domain];
  const isCorrect =
    submitted &&
    [...selectedOptions].sort().join(",") ===
      [...currentQ.correctIndices].sort().join(",");

  const scoredSoFar = answers.slice(0, currentIndex).filter((a, i) => {
    if (!a) return false;
    return (
      [...a].sort().join(",") ===
      [...questions[i].correctIndices].sort().join(",")
    );
  }).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.headerBtn}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCount}>
            {currentIndex + 1}
            <Text style={styles.headerCountOf}> / {questions.length}</Text>
          </Text>
          {/* Station indicator badge */}
          <View style={[styles.domainBadge, { borderColor: meta.color }]}>
            <View style={[styles.domainDot, { backgroundColor: meta.color }]} />
            <Text style={[styles.domainBadgeText, { color: meta.color }]}>
              {meta.label.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
      </View>

      {/* Route progress */}
      <View style={styles.routeProgressWrap}>
        <View style={styles.routeProgressBg}>
          <View
            style={[
              styles.routeProgressFill,
              {
                width:
                  `${((currentIndex + 1) / questions.length) * 100}%` as any,
                backgroundColor: meta.color,
              },
            ]}
          />
        </View>
        <View style={styles.scoreTracker}>
          <Text style={styles.scoreTrackerLabel}>QUESTION PROGRESS</Text>
          <View style={[styles.typeBadge, { borderColor: meta.color }]}>
            <Text style={[styles.typeBadgeText, { color: meta.color }]}>
              {currentQ.type === "multi"
                ? "Select all that apply"
                : "Select one"}
            </Text>
          </View>
          <Text style={styles.scoreTrackerText}>
            {scoredSoFar}/{currentIndex}
          </Text>
        </View>
      </View>

      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question */}
          <View style={[styles.questionCard, { borderLeftColor: meta.color }]}>
            <View style={styles.questionMeta}>
              <View style={[styles.serviceBadge, { borderColor: meta.color }]}>
                <View
                  style={[styles.serviceDot, { backgroundColor: meta.color }]}
                />
                <Text style={[styles.serviceBadgeText, { color: meta.color }]}>
                  {currentQ.service}
                </Text>
              </View>
              <Text
                style={[
                  styles.diffText,
                  {
                    color:
                      currentQ.difficulty === "easy"
                        ? colors.easy
                        : currentQ.difficulty === "medium"
                          ? colors.medium
                          : colors.hard,
                  },
                ]}
              >
                {currentQ.difficulty.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.questionText}>{currentQ.question}</Text>
          </View>

          {/* Options */}
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(idx);
            const isCorrectOption = currentQ.correctIndices.includes(idx);
            const isMissed =
              submitted &&
              currentQ.type === "multi" &&
              isCorrectOption &&
              !isSelected;

            let bgColor = colors.surface;
            let borderColor = colors.border;
            let textColor = colors.textPrimary;
            let icon: string | null = null;

            if (submitted) {
              if (isMissed) {
                bgColor = colors.correct + "12";
                borderColor = colors.correct;
                textColor = colors.correct;
                icon = "checkmark-circle";
              } else if (isCorrectOption && isSelected) {
                bgColor = colors.correct + "12";
                borderColor = colors.correct;
                textColor = colors.correct;
                icon = "checkmark-circle";
              } else if (!isCorrectOption && isSelected) {
                bgColor = colors.incorrect + "12";
                borderColor = colors.incorrect;
                textColor = colors.incorrect;
                icon = "close-circle";
              } else if (isCorrectOption && currentQ.type === "single") {
                bgColor = colors.correct + "12";
                borderColor = colors.correct;
                textColor = colors.correct;
                icon = "checkmark-circle";
              }
            } else if (isSelected) {
              bgColor = meta.color + "15";
              borderColor = meta.color;
            }

            const checkboxColor = isMissed
              ? colors.correct
              : isCorrectOption && isSelected
                ? colors.correct
                : isSelected && !isCorrectOption
                  ? colors.incorrect
                  : isCorrectOption && currentQ.type === "single" && submitted
                    ? colors.correct
                    : undefined;

            const showInnerRing =
              currentQ.type === "multi" && isSelected && submitted;

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.option,
                  { backgroundColor: bgColor, borderColor },
                ]}
                onPress={() => toggleOption(idx)}
                disabled={submitted}
                activeOpacity={0.8}
              >
                {showInnerRing && (
                  <View
                    style={[
                      styles.innerRing,
                      { borderColor: meta.color + "88" },
                    ]}
                    pointerEvents="none"
                  />
                )}
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      currentQ.type === "single"
                        ? styles.radio
                        : styles.checkbox,
                      isSelected && !submitted && { borderColor: meta.color },
                      checkboxColor && submitted
                        ? {
                            borderColor: checkboxColor,
                            backgroundColor: isMissed
                              ? "transparent"
                              : checkboxColor,
                          }
                        : undefined,
                    ]}
                  >
                    {(isSelected ||
                      (submitted &&
                        isCorrectOption &&
                        (currentQ.type === "single" || isSelected))) && (
                      <View
                        style={[
                          currentQ.type === "single"
                            ? styles.radioDot
                            : styles.checkMark,
                          submitted
                            ? { backgroundColor: colors.surface }
                            : { backgroundColor: meta.color },
                        ]}
                      />
                    )}
                  </View>
                </View>
                <Text style={[styles.optionText, { color: textColor }]}>
                  {option}
                </Text>
                {submitted && icon && (
                  <Ionicons
                    name={icon as any}
                    size={18}
                    color={
                      isMissed
                        ? colors.correct
                        : isCorrectOption && isSelected
                          ? colors.correct
                          : isCorrectOption && currentQ.type === "single"
                            ? colors.correct
                            : colors.incorrect
                    }
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Explanation */}
          {submitted && (
            <View
              style={[
                styles.explanationCard,
                {
                  borderLeftColor: isCorrect
                    ? colors.correct
                    : colors.incorrect,
                },
              ]}
            >
              <View style={styles.explanationHeader}>
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={isCorrect ? colors.correct : colors.incorrect}
                />
                <Text
                  style={[
                    styles.explanationTitle,
                    { color: isCorrect ? colors.correct : colors.incorrect },
                  ]}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </Text>
              </View>

              {!isCorrect &&
                currentQ.optionExplanations &&
                selectedOptions
                  .filter((idx) => !currentQ.correctIndices.includes(idx))
                  .map((idx) => (
                    <View key={idx} style={styles.wrongReasonBox}>
                      <View style={styles.wrongReasonHeader}>
                        <Ionicons
                          name="close-circle"
                          size={13}
                          color={colors.incorrect}
                        />
                        <AbbreviatedText
                          text={currentQ.options[idx]}
                          style={styles.wrongReasonLabel}
                        />
                      </View>
                      <AbbreviatedText
                        text={currentQ.optionExplanations![idx]}
                        style={styles.wrongReasonText}
                      />
                    </View>
                  ))}

              <View style={styles.correctReasonBox}>
                <View style={styles.explanationSubHeader}>
                  <Ionicons
                    name="bulb-outline"
                    size={13}
                    color={colors.correct}
                  />
                  <Text style={styles.explanationSubTitle}>
                    {isCorrect
                      ? "Why this is correct"
                      : "Why the correct answer is right"}
                  </Text>
                </View>
                <AbbreviatedText
                  text={currentQ.explanation}
                  style={styles.explanationText}
                />
              </View>

              <View style={styles.tagRow}>
                {currentQ.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>
      </WebContainer>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor:
                  selectedOptions.length === 0 ? colors.border : meta.color,
              },
            ]}
            onPress={handleSubmit}
            disabled={selectedOptions.length === 0}
          >
            <Text
              style={[
                styles.actionBtnText,
                {
                  color:
                    selectedOptions.length === 0 ? colors.textMuted : "#FFFFFF",
                },
              ]}
            >
              Submit Answer
            </Text>
          </TouchableOpacity>
        ) : currentIndex < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
              Next Question
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.correct }]}
            onPress={() =>
              navigation.navigate("QuizResult", {
                sessionId: Date.now().toString(),
              })
            }
          >
            <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>
              View Results
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: fontSize.lg, color: colors.textMuted },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
    },
    headerBtn: { padding: spacing.xs },
    headerCenter: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    headerCount: {
      fontSize: fontSize.md,
      fontWeight: "800",
      color: colors.textPrimary,
      fontVariant: ["tabular-nums"],
    },
    headerCountOf: {
      fontSize: fontSize.sm,
      fontWeight: "400",
      color: colors.textMuted,
    },
    domainBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderWidth: 1,
      borderRadius: radius.sm,
    },
    domainDot: {
      width: STATION_DOT_SIZE - 4,
      height: STATION_DOT_SIZE - 4,
      borderRadius: (STATION_DOT_SIZE - 4) / 2,
    },
    domainBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    timerText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textSecondary,
      fontVariant: ["tabular-nums"],
      minWidth: 42,
      textAlign: "right",
    },

    routeProgressWrap: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      gap: 6,
    },
    routeProgressBg: {
      height: ROUTE_LINE_WIDTH,
      backgroundColor: colors.rule,
      borderRadius: 2,
      overflow: "hidden",
    },
    routeProgressFill: {
      height: "100%" as any,
      borderRadius: 2,
    },
    scoreTracker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: spacing.xs,
    },
    scoreTrackerLabel: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.textMuted,
      letterSpacing: 1.5,
    },
    typeBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderWidth: 1,
      borderRadius: radius.sm,
    },
    typeBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
    scoreTrackerText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      fontVariant: ["tabular-nums"],
    },

    scroll: { flex: 1 },
    scrollContent: { padding: spacing.md, gap: spacing.sm },

    questionCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: ROUTE_LINE_WIDTH,
      marginBottom: spacing.xs,
    },
    questionMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    serviceBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderWidth: 1,
      borderRadius: radius.sm,
    },
    serviceDot: {
      width: STATION_DOT_SIZE - 4,
      height: STATION_DOT_SIZE - 4,
      borderRadius: (STATION_DOT_SIZE - 4) / 2,
    },
    serviceBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
    diffText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    questionText: {
      fontSize: fontSize.md,
      fontWeight: "600",
      color: colors.textPrimary,
      lineHeight: 24,
    },

    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      gap: spacing.sm,
    },
    innerRing: {
      position: "absolute",
      inset: 3,
      borderRadius: radius.md - 2,
      borderWidth: 1,
      pointerEvents: "none",
    },
    optionLeft: { width: 24, alignItems: "center" },
    radio: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    radioDot: { width: 8, height: 8, borderRadius: radius.full },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkMark: { width: 10, height: 10, borderRadius: 2 },
    optionText: { flex: 1, fontSize: fontSize.sm, lineHeight: 20 },

    explanationCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: ROUTE_LINE_WIDTH,
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    explanationHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    explanationTitle: {
      fontSize: fontSize.md,
      fontWeight: "800",
    },

    wrongReasonBox: {
      borderTopWidth: 1,
      borderTopColor: colors.rule,
      paddingTop: spacing.sm,
      gap: 4,
    },
    wrongReasonHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    wrongReasonLabel: {
      flex: 1,
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.incorrect,
    },
    wrongReasonText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    correctReasonBox: {
      borderTopWidth: 1,
      borderTopColor: colors.rule,
      paddingTop: spacing.sm,
      gap: 6,
    },
    explanationSubHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    explanationSubTitle: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.correct,
    },
    explanationText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tagRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 4,
    },
    tag: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tagText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },

    bottomBar: {
      padding: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.rule,
    },
    submitBtn: {
      borderRadius: radius.sm,
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    actionBtnText: {
      fontSize: fontSize.lg,
      fontWeight: "800",
    },
  });
}
