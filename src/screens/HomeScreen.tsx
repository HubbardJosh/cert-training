import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
} from "../utils/theme";
import {
  loadProgress,
  getDomainAccuracy,
  getExamReadiness,
} from "../utils/storage";
import { UserProgress, Domain } from "../types";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useTopic } from "../context/TopicContext";
import { useActiveData, useActiveStorageKey } from "../context/useActiveData";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useBreakpoint } from "../hooks/useBreakpoint";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const { topicId, topicMeta } = useTopic();
  const isTopicMode = topicId !== null;
  const activeStorageKey = useActiveStorageKey();
  const { flashcards, quizQuestions, guides } = useActiveData();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { colors } = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);

  useFocusEffect(
    useCallback(() => {
      loadProgress(activeStorageKey).then(setProgress);
    }, [activeStorageKey]),
  );

  const overallAccuracy =
    progress && !isTopicMode
      ? getExamReadiness(progress, certMeta, flashcards.length)
      : 0;
  const totalStudied = progress
    ? Object.values(progress.studiedCards).filter((s) => s === "known").length
    : 0;
  const totalCards = flashcards.length;
  const totalQuizQ = quizQuestions.length;
  const lastQuizScore =
    progress && progress.quizHistory.length > 0
      ? Math.round(
          (progress.quizHistory[progress.quizHistory.length - 1].score /
            progress.quizHistory[progress.quizHistory.length - 1].total) *
            100,
        )
      : null;
  const guidesViewed = progress
    ? Object.values(progress.guideProgress).filter((g) => g.completed).length
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader />
      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {isTopicMode ? (topicMeta?.name ?? "Topic") : certMeta.name}
            </Text>
            <Text style={styles.subtitle}>
              {isTopicMode ? (topicMeta?.fullName ?? "") : certMeta.fullName}
            </Text>
          </View>

          {/* Tagline banner — topic mode */}
          {isTopicMode && topicMeta && (
            <View
              style={[
                styles.examBanner,
                { backgroundColor: topicMeta.color + "18" },
              ]}
            >
              <Ionicons name="telescope" size={18} color={topicMeta.color} />
              <Text style={[styles.examBannerText, { color: topicMeta.color }]}>
                {topicMeta.tagline}
              </Text>
            </View>
          )}

          {/* Exam info banner — cert mode only */}
          {!isTopicMode && (
            <View style={styles.examBanner}>
              <Ionicons
                name="information-circle"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.examBannerText}>{certMeta.examInfo}</Text>
            </View>
          )}

          {/* Overall stats */}
          <View style={styles.statsRow}>
            {isTopicMode ? (
              <>
                <StatCard
                  icon="book-outline"
                  color={topicMeta?.color ?? colors.accent}
                  label="Cards Mastered"
                  value={`${totalStudied}/${totalCards}`}
                  colors={colors}
                />
                <StatCard
                  icon="library-outline"
                  color={colors.accent}
                  label="Guides Done"
                  value={`${guidesViewed}/${guides.length}`}
                  colors={colors}
                />
                <StatCard
                  icon="trophy-outline"
                  color={colors.correct}
                  label="Last Quiz"
                  value={lastQuizScore !== null ? `${lastQuizScore}%` : "–"}
                  colors={colors}
                />
              </>
            ) : (
              <>
                <StatCard
                  icon="checkmark-circle"
                  color={colors.correct}
                  label="Readiness"
                  value={`${overallAccuracy}%`}
                  colors={colors}
                />
                <StatCard
                  icon="book-outline"
                  color={colors.accent}
                  label="Cards Mastered"
                  value={`${totalStudied}/${totalCards}`}
                  colors={colors}
                />
                <StatCard
                  icon="help-circle"
                  color={colors.primary}
                  label="Quiz Questions"
                  value={`${totalQuizQ}`}
                  colors={colors}
                />
              </>
            )}
          </View>

          {/* Domain breakdown — cert mode only */}
          {!isTopicMode && (
            <>
              <Text style={styles.sectionTitle}>Exam Domains</Text>
              <View style={isDesktop ? styles.twoColGrid : undefined}>
                {DOMAINS.map((domain) => {
                  const meta = DOMAIN_META[domain];
                  const accuracy = progress
                    ? getDomainAccuracy(progress, domain)
                    : 0;
                  const attempted = progress
                    ? progress.domainScores[domain].attempted
                    : 0;
                  const domainCards = flashcards.filter(
                    (c) => c.domain === domain,
                  ).length;
                  const domainQuestions = quizQuestions.filter(
                    (q) => q.domain === domain,
                  ).length;

                  return (
                    <View
                      key={domain}
                      style={[
                        styles.domainCard,
                        isDesktop && { flexBasis: "48%", flexGrow: 1 },
                      ]}
                    >
                      <View style={styles.domainHeader}>
                        <View
                          style={[
                            styles.domainIcon,
                            { backgroundColor: meta.color + "22" },
                          ]}
                        >
                          <Ionicons
                            name={meta.icon as any}
                            size={20}
                            color={meta.color}
                          />
                        </View>
                        <View style={styles.domainInfo}>
                          <Text style={styles.domainLabel}>{meta.label}</Text>
                          <Text style={styles.domainMeta}>
                            {domainCards} cards · {domainQuestions} quiz
                            questions · {meta.weight} of exam
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.domainAccuracy,
                            { color: accuracyColor(accuracy, colors) },
                          ]}
                        >
                          {attempted > 0 ? `${accuracy}%` : "–"}
                        </Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${accuracy}%`,
                              backgroundColor: meta.color,
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.domainActions}>
                        <TouchableOpacity
                          style={[
                            styles.domainBtn,
                            { borderColor: meta.color },
                          ]}
                          onPress={() =>
                            navigation.navigate("FlashCard", {
                              domain,
                              difficulty: "all",
                            })
                          }
                        >
                          <Ionicons
                            name="book-outline"
                            size={14}
                            color={meta.color}
                          />
                          <Text
                            style={[
                              styles.domainBtnText,
                              { color: meta.color },
                            ]}
                          >
                            Study
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.domainBtn,
                            { borderColor: meta.color },
                          ]}
                          onPress={() =>
                            navigation.navigate("Quiz", {
                              domain,
                              difficulty: "all",
                              count: 10,
                            })
                          }
                        >
                          <Ionicons
                            name="trophy-outline"
                            size={14}
                            color={meta.color}
                          />
                          <Text
                            style={[
                              styles.domainBtnText,
                              { color: meta.color },
                            ]}
                          >
                            Quiz
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Quick start */}
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[
                styles.quickCard,
                {
                  backgroundColor:
                    (isTopicMode ? topicMeta?.color : colors.primary) + "18",
                },
              ]}
              onPress={() =>
                navigation.navigate("FlashCard", {
                  domain: "all",
                  difficulty: "all",
                })
              }
            >
              <Ionicons
                name="shuffle"
                size={28}
                color={isTopicMode ? topicMeta?.color : colors.primary}
              />
              <Text style={styles.quickLabel}>Random Flashcards</Text>
              <Text style={styles.quickSub}>All {totalCards} cards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickCard,
                { backgroundColor: colors.accent + "18" },
              ]}
              onPress={() =>
                navigation.navigate("Quiz", {
                  domain: "all",
                  difficulty: "all",
                  count: Math.min(20, quizQuestions.length),
                })
              }
            >
              <Ionicons name="timer" size={28} color={colors.accent} />
              <Text style={styles.quickLabel}>Practice Quiz</Text>
              <Text style={styles.quickSub}>
                {Math.min(20, quizQuestions.length)} questions · timed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guides list — topic mode */}
          {isTopicMode && (
            <>
              <Text style={styles.sectionTitle}>
                Study Guides ({guides.length})
              </Text>
              {guides.map((guide) => {
                const gProgress = progress?.guideProgress?.[guide.id];
                const completed = gProgress?.completed ?? false;
                const viewed = !!gProgress;
                const accentColor = topicMeta?.color ?? colors.primary;
                return (
                  <TouchableOpacity
                    key={guide.id}
                    style={styles.guideCard}
                    onPress={() =>
                      navigation.navigate("GuideDetail", { id: guide.id })
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.guideIcon,
                        { backgroundColor: accentColor + "22" },
                      ]}
                    >
                      <Ionicons
                        name={completed ? "checkmark-circle" : "book-outline"}
                        size={22}
                        color={completed ? colors.correct : accentColor}
                      />
                    </View>
                    <View style={styles.guideText}>
                      <Text style={styles.guideName}>{guide.service}</Text>
                      <Text style={styles.guideTagline} numberOfLines={1}>
                        {guide.tagline}
                      </Text>
                      <Text style={styles.guideMeta}>
                        {guide.sections.length} sections ·{" "}
                        {guide.keyFacts.length} key facts
                      </Text>
                    </View>
                    <View style={styles.guideStatus}>
                      {completed ? (
                        <Text
                          style={[
                            styles.guideStatusText,
                            { color: colors.correct },
                          ]}
                        >
                          Done
                        </Text>
                      ) : viewed ? (
                        <Text
                          style={[
                            styles.guideStatusText,
                            { color: colors.warning },
                          ]}
                        >
                          In Progress
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.guideStatusText,
                            { color: colors.textMuted },
                          ]}
                        >
                          New
                        </Text>
                      )}
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={colors.textMuted}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Exam tips — cert mode only */}
          {!isTopicMode && (
            <>
              <Text style={styles.sectionTitle}>Exam Tips</Text>
              {EXAM_TIPS.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <Ionicons
                    name="bulb-outline"
                    size={18}
                    color={colors.primary}
                    style={styles.tipIcon}
                  />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </>
          )}

          {/* Sources link — always shown */}
          <TouchableOpacity
            style={styles.sourcesBtn}
            onPress={() => navigation.navigate("Sources")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="document-text-outline"
              size={15}
              color={colors.textMuted}
            />
            <Text style={styles.sourcesBtnText}>View sources & references</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  color,
  label,
  value,
  colors,
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={[styles.statCard, { borderColor: color + "44" }]}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function accuracyColor(pct: number, colors: ThemeColors): string {
  if (pct >= 80) return colors.correct;
  if (pct >= 60) return colors.warning;
  return colors.incorrect;
}

const EXAM_TIPS = [
  "Lambda + SQS: set visibility timeout to 6× the function timeout to prevent duplicate processing.",
  "DynamoDB hot partitions: avoid low-cardinality partition keys (status, boolean fields).",
  "IAM evaluation: explicit Deny always wins — SCPs, permission boundaries, then identity policies.",
  "KMS Encrypt is limited to 4 KB — use envelope encryption (GenerateDataKey) for larger data.",
  "CodeDeploy canary for Lambda: small % → wait → remainder (e.g. Canary10Percent5Minutes).",
  "CloudWatch EMF: embed custom metrics in logs to avoid costly PutMetricData API calls.",
  "SQS FIFO vs. Standard: FIFO = exactly-once + ordered but capped at 3,000 msg/s with batching.",
  "RDS Proxy: essential for Lambda → RDS to prevent connection exhaustion during traffic spikes.",
];

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { padding: spacing.md },

    header: {
      marginBottom: spacing.md,
    },
    greeting: {
      fontSize: fontSize.xxl,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    examBanner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "15",
      borderRadius: radius.md,
      padding: spacing.sm + 4,
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    examBannerText: {
      fontSize: fontSize.sm,
      color: colors.primary,
      fontWeight: "600",
    },

    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.sm + 2,
      alignItems: "center",
      borderWidth: 1,
      gap: 4,
    },
    statValue: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    statLabel: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      textAlign: "center",
    },

    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },

    twoColGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    domainCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    domainHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    domainIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    domainInfo: { flex: 1 },
    domainLabel: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    domainMeta: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    domainAccuracy: { fontSize: fontSize.lg, fontWeight: "800" },
    progressBarBg: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: radius.full,
      marginBottom: spacing.sm,
      overflow: "hidden",
    },
    progressBarFill: { height: "100%", borderRadius: radius.full },
    domainActions: { flexDirection: "row", gap: spacing.sm },
    domainBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderWidth: 1,
      borderRadius: radius.sm,
      paddingVertical: 8,
    },
    domainBtnText: { fontSize: fontSize.sm, fontWeight: "600" },

    quickRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    quickCard: {
      flex: 1,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: "center",
      gap: spacing.xs,
    },
    quickLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },
    quickSub: { fontSize: fontSize.xs, color: colors.textSecondary },

    tipCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.sm + 4,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "flex-start",
    },
    tipIcon: { marginRight: spacing.sm, marginTop: 1 },
    tipText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    sourcesBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      justifyContent: "center",
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    sourcesBtnText: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
    },

    guideCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    guideIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    guideText: { flex: 1, gap: 2 },
    guideName: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    guideTagline: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    guideMeta: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 1,
    },
    guideStatus: {
      alignItems: "flex-end",
      gap: 2,
    },
    guideStatusText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
  });
}
