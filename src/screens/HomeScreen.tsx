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
  ROUTE_LINE_WIDTH,
  STATION_DOT_SIZE,
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

  const accentColor = isTopicMode
    ? (topicMeta?.color ?? colors.primary)
    : colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader />
      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Destination sign header */}
          <View style={styles.destinationSign}>
            <View
              style={[styles.routeIndicator, { backgroundColor: accentColor }]}
            />
            <View style={styles.destinationText}>
              <Text style={styles.destinationName}>
                {isTopicMode ? (topicMeta?.name ?? "Topic") : certMeta.name}
              </Text>
              <Text style={styles.destinationFull}>
                {isTopicMode ? (topicMeta?.fullName ?? "") : certMeta.fullName}
              </Text>
            </View>
          </View>

          {/* Tagline banner — topic mode */}
          {isTopicMode && topicMeta && (
            <View
              style={[styles.infoBanner, { borderLeftColor: topicMeta.color }]}
            >
              <Ionicons name="telescope" size={15} color={topicMeta.color} />
              <Text style={[styles.infoBannerText, { color: topicMeta.color }]}>
                {topicMeta.tagline}
              </Text>
            </View>
          )}

          {/* Exam info banner — cert mode only */}
          {!isTopicMode && (
            <View
              style={[styles.infoBanner, { borderLeftColor: colors.primary }]}
            >
              <Ionicons
                name="information-circle"
                size={15}
                color={colors.primary}
              />
              <Text
                style={[styles.infoBannerText, { color: colors.textSecondary }]}
              >
                {certMeta.examInfo}
              </Text>
            </View>
          )}

          {/* Departure board stats */}
          <View style={styles.departureBoard}>
            <View style={styles.departureBoardHeader}>
              <Text style={styles.departureBoardLabel}>YOUR PROGRESS</Text>
            </View>
            <View style={styles.departureBoardRows}>
              {isTopicMode ? (
                <>
                  <DepartureRow
                    label="Cards Mastered"
                    value={`${totalStudied}/${totalCards}`}
                    color={topicMeta?.color ?? colors.primary}
                    colors={colors}
                  />
                  <DepartureRow
                    label="Guides Done"
                    value={`${guidesViewed}/${guides.length}`}
                    color={colors.accent}
                    colors={colors}
                  />
                  <DepartureRow
                    label="Last Quiz"
                    value={lastQuizScore !== null ? `${lastQuizScore}%` : "—"}
                    color={colors.correct}
                    colors={colors}
                  />
                </>
              ) : (
                <>
                  <DepartureRow
                    label="Readiness"
                    value={`${overallAccuracy}%`}
                    color={
                      overallAccuracy >= 80
                        ? colors.correct
                        : overallAccuracy >= 60
                          ? colors.warning
                          : colors.incorrect
                    }
                    colors={colors}
                  />
                  <DepartureRow
                    label="Cards Mastered"
                    value={`${totalStudied}/${totalCards}`}
                    color={colors.primary}
                    colors={colors}
                  />
                  <DepartureRow
                    label="Quiz Questions"
                    value={`${totalQuizQ}`}
                    color={colors.accent}
                    colors={colors}
                  />
                </>
              )}
            </View>
          </View>

          {/* Route lines / domain breakdown — cert mode only */}
          {!isTopicMode && (
            <>
              <Text style={styles.sectionLabel}>DOMAINS</Text>
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
                  const stationsTotal = domainCards;
                  const stationsTraveled = progress
                    ? Object.entries(progress.studiedCards).filter(
                        ([id, s]) =>
                          s === "known" &&
                          flashcards.find((c) => c.id === id)?.domain ===
                            domain,
                      ).length
                    : 0;

                  return (
                    <RouteCard
                      key={domain}
                      domain={domain}
                      meta={meta}
                      accuracy={accuracy}
                      attempted={attempted}
                      stationsTotal={stationsTotal}
                      stationsTraveled={stationsTraveled}
                      domainCards={domainCards}
                      domainQuestions={domainQuestions}
                      colors={colors}
                      isDesktop={isDesktop}
                      onStudy={() =>
                        navigation.navigate("FlashCard", {
                          domain,
                          difficulty: "all",
                        })
                      }
                      onQuiz={() =>
                        navigation.navigate("Quiz", {
                          domain,
                          difficulty: "all",
                          count: 10,
                        })
                      }
                    />
                  );
                })}
              </View>
            </>
          )}

          {/* Quick start */}
          <Text style={styles.sectionLabel}>QUICK START</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[styles.quickCard, { borderTopColor: accentColor }]}
              onPress={() =>
                navigation.navigate("FlashCard", {
                  domain: "all",
                  difficulty: "all",
                })
              }
              activeOpacity={0.8}
            >
              <View
                style={[styles.quickDot, { backgroundColor: accentColor }]}
              />
              <Text style={styles.quickLabel}>Flashcards</Text>
              <Text style={styles.quickCount}>{totalCards}</Text>
              <Text style={styles.quickSub}>cards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickCard, { borderTopColor: colors.accent }]}
              onPress={() =>
                navigation.navigate("Quiz", {
                  domain: "all",
                  difficulty: "all",
                  count: Math.min(20, quizQuestions.length),
                })
              }
              activeOpacity={0.8}
            >
              <View
                style={[styles.quickDot, { backgroundColor: colors.accent }]}
              />
              <Text style={styles.quickLabel}>Practice Quiz</Text>
              <Text style={styles.quickCount}>
                {Math.min(20, quizQuestions.length)}
              </Text>
              <Text style={styles.quickSub}>timed</Text>
            </TouchableOpacity>
          </View>

          {/* Guides list — topic mode */}
          {isTopicMode && (
            <>
              <Text style={styles.sectionLabel}>
                STUDY GUIDES · {guides.length}
              </Text>
              {guides.map((guide) => {
                const gProgress = progress?.guideProgress?.[guide.id];
                const completed = gProgress?.completed ?? false;
                const viewed = !!gProgress;
                const lineColor = topicMeta?.color ?? colors.primary;
                return (
                  <TouchableOpacity
                    key={guide.id}
                    style={styles.stationRow}
                    onPress={() =>
                      navigation.navigate("GuideDetail", { id: guide.id })
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.stationLineCol}>
                      <View
                        style={[
                          styles.stationLine,
                          { backgroundColor: lineColor },
                        ]}
                      />
                      <View
                        style={[
                          styles.stationDot,
                          {
                            borderColor: lineColor,
                            backgroundColor: completed
                              ? lineColor
                              : colors.surface,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.stationLine,
                          { backgroundColor: lineColor },
                        ]}
                      />
                    </View>
                    <View style={styles.stationContent}>
                      <Text style={styles.stationName}>{guide.service}</Text>
                      <Text style={styles.stationTagline} numberOfLines={1}>
                        {guide.tagline}
                      </Text>
                      <Text style={styles.stationMeta}>
                        {guide.sections.length} sections ·{" "}
                        {guide.keyFacts.length} key facts
                      </Text>
                    </View>
                    <View style={styles.stationStatus}>
                      <Text
                        style={[
                          styles.stationStatusText,
                          {
                            color: completed
                              ? colors.correct
                              : viewed
                                ? colors.warning
                                : colors.textMuted,
                          },
                        ]}
                      >
                        {completed ? "Done" : viewed ? "In Progress" : "New"}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
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
              <Text style={styles.sectionLabel}>EXAM TIPS</Text>
              {EXAM_TIPS.map((tip, i) => (
                <View key={i} style={styles.noticeRow}>
                  <View style={styles.noticeBullet} />
                  <Text style={styles.noticeText}>{tip}</Text>
                </View>
              ))}
            </>
          )}

          {/* Sources link */}
          <TouchableOpacity
            style={styles.sourcesLink}
            onPress={() => navigation.navigate("Sources")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="document-text-outline"
              size={13}
              color={colors.textMuted}
            />
            <Text style={styles.sourcesLinkText}>Sources & references</Text>
            <Ionicons
              name="chevron-forward"
              size={12}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}

function DepartureRow({
  label,
  value,
  color,
  colors,
}: {
  label: string;
  value: string;
  color: string;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.departureRow}>
      <View style={[styles.departureDot, { backgroundColor: color }]} />
      <Text style={styles.departureLabel}>{label}</Text>
      <Text style={[styles.departureValue, { color }]}>{value}</Text>
    </View>
  );
}

function RouteCard({
  domain,
  meta,
  accuracy,
  attempted,
  stationsTotal,
  stationsTraveled,
  domainCards,
  domainQuestions,
  colors,
  isDesktop,
  onStudy,
  onQuiz,
}: {
  domain: string;
  meta: { label: string; color: string; weight: string; icon: string };
  accuracy: number;
  attempted: number;
  stationsTotal: number;
  stationsTraveled: number;
  domainCards: number;
  domainQuestions: number;
  colors: ThemeColors;
  isDesktop: boolean;
  onStudy: () => void;
  onQuiz: () => void;
}) {
  const styles = makeStyles(colors);
  const travelPct =
    stationsTotal > 0
      ? Math.round((stationsTraveled / stationsTotal) * 100)
      : 0;

  return (
    <View
      style={[styles.routeCard, isDesktop && { flexBasis: "48%", flexGrow: 1 }]}
    >
      {/* Route line strip */}
      <View style={[styles.routeStrip, { backgroundColor: meta.color }]} />

      <View style={styles.routeCardBody}>
        <View style={styles.routeCardHeader}>
          <View style={styles.routeCardTitle}>
            <Text style={[styles.routeLabel, { color: meta.color }]}>
              {meta.label.toUpperCase()}
            </Text>
            <Text style={styles.routeWeight}>{meta.weight} of exam</Text>
          </View>
          <Text
            style={[
              styles.routeAccuracy,
              {
                color:
                  attempted === 0
                    ? colors.textMuted
                    : accuracy >= 80
                      ? colors.correct
                      : accuracy >= 60
                        ? colors.warning
                        : colors.incorrect,
              },
            ]}
          >
            {attempted > 0 ? `${accuracy}%` : "—"}
          </Text>
        </View>

        {/* Station progress track */}
        <View style={styles.stationTrack}>
          <View
            style={[styles.trackLine, { backgroundColor: meta.color + "30" }]}
          >
            <View
              style={[
                styles.trackFill,
                {
                  width: `${travelPct}%` as any,
                  backgroundColor: meta.color,
                },
              ]}
            />
          </View>
          <Text style={styles.trackLabel}>
            {stationsTraveled}/{stationsTotal} cards · {domainQuestions} quiz
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.routeActions}>
          <TouchableOpacity
            style={[styles.routeBtn, { borderColor: meta.color }]}
            onPress={onStudy}
          >
            <Text style={[styles.routeBtnText, { color: meta.color }]}>
              Study
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.routeBtn, { borderColor: meta.color }]}
            onPress={onQuiz}
          >
            <Text style={[styles.routeBtnText, { color: meta.color }]}>
              Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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

    // Destination sign header
    destinationSign: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    routeIndicator: {
      width: ROUTE_LINE_WIDTH,
      height: 44,
      borderRadius: 2,
    },
    destinationText: { flex: 1 },
    destinationName: {
      fontSize: fontSize.xxl,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    destinationFull: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 1,
    },

    // Info banner
    infoBanner: {
      flexDirection: "row",
      alignItems: "center",
      borderLeftWidth: 3,
      paddingLeft: spacing.sm,
      paddingVertical: spacing.xs,
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    infoBannerText: {
      fontSize: fontSize.sm,
      lineHeight: 18,
      flex: 1,
    },

    // Departure board
    departureBoard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      overflow: "hidden",
    },
    departureBoardHeader: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
      backgroundColor: colors.surfaceElevated,
    },
    departureBoardLabel: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.textMuted,
      letterSpacing: 1.5,
    },
    departureBoardRows: {},
    departureRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
      gap: spacing.sm,
    },
    departureDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    departureLabel: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    departureValue: {
      fontSize: fontSize.md,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
      minWidth: 56,
      textAlign: "right",
    },

    // Section labels — transit map style
    sectionLabel: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.textMuted,
      letterSpacing: 1.5,
      marginBottom: spacing.sm,
      marginTop: spacing.sm,
    },

    // Route cards
    twoColGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    routeCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
      overflow: "hidden",
    },
    routeStrip: {
      width: ROUTE_LINE_WIDTH,
    },
    routeCardBody: {
      flex: 1,
      padding: spacing.md,
      gap: spacing.sm,
    },
    routeCardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    routeCardTitle: { flex: 1 },
    routeLabel: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      letterSpacing: 1,
    },
    routeWeight: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 1,
    },
    routeAccuracy: {
      fontSize: fontSize.xl,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
    },
    stationTrack: { gap: 4 },
    trackLine: {
      height: 3,
      borderRadius: 2,
      overflow: "hidden",
    },
    trackFill: { height: "100%" as any, borderRadius: 2 },
    trackLabel: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    routeActions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    routeBtn: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 7,
      borderWidth: 1,
      borderRadius: radius.sm,
    },
    routeBtnText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
    },

    // Quick start
    quickRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    quickCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopWidth: 3,
      padding: spacing.md,
      alignItems: "center",
      gap: 2,
    },
    quickDot: {
      width: STATION_DOT_SIZE,
      height: STATION_DOT_SIZE,
      borderRadius: STATION_DOT_SIZE / 2,
      marginBottom: spacing.xs,
    },
    quickLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
    },
    quickCount: {
      fontSize: fontSize.xl,
      fontWeight: "800",
      color: colors.textPrimary,
      fontVariant: ["tabular-nums"],
    },
    quickSub: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },

    // Station rows (guide list in topic mode)
    stationRow: {
      flexDirection: "row",
      alignItems: "stretch",
      marginBottom: spacing.xs,
      minHeight: 60,
    },
    stationLineCol: {
      width: 24,
      alignItems: "center",
    },
    stationLine: {
      flex: 1,
      width: 2,
    },
    stationDot: {
      width: STATION_DOT_SIZE,
      height: STATION_DOT_SIZE,
      borderRadius: STATION_DOT_SIZE / 2,
      borderWidth: 2,
      marginVertical: 2,
    },
    stationContent: {
      flex: 1,
      paddingLeft: spacing.sm,
      paddingVertical: spacing.xs,
      gap: 2,
    },
    stationName: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    stationTagline: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    stationMeta: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    stationStatus: {
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 2,
      paddingLeft: spacing.xs,
    },
    stationStatusText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },

    // Notices
    noticeRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: spacing.xs,
      gap: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
    },
    noticeBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.textMuted,
      marginTop: 6,
    },
    noticeText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    // Sources
    sourcesLink: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      justifyContent: "center",
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    sourcesLinkText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
  });
}
