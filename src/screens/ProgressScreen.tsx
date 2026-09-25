import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
  ROUTE_LINE_WIDTH,
} from "../utils/theme";
import {
  loadProgress,
  saveProgress,
  resetProgress,
  resetGuideProgress,
  resetAllGuides,
  resetAllFlashcards,
  resetAllQuizzes,
  resetDomainScore,
  getDomainAccuracy,
  getExamReadiness,
  getGuidesCompleted,
  getGuidesViewed,
  toggleNeedsReview,
  getSortedWeakTopics,
} from "../utils/storage";
import { UserProgress, Domain, QuizAttempt, WeakTopic } from "../types";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useTopic } from "../context/TopicContext";
import { useActiveData, useActiveStorageKey } from "../context/useActiveData";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";
import ScreenHeader from "../components/ScreenHeader";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function ProgressScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const { topicId, topicMeta } = useTopic();
  const isTopicMode = topicId !== null;
  const activeStorageKey = useActiveStorageKey();
  const { flashcards, guides: allGuides } = useActiveData();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { colors } = useTheme();
  const DOMAIN_META = getDomainMeta(colors);

  useEffect(() => {
    loadProgress(activeStorageKey).then(setProgress);
  }, [activeStorageKey]);

  const handleReset = () => {
    Alert.alert(
      "Reset All Progress",
      "This will clear all quiz history, flashcard status, and scores. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProgress(activeStorageKey);
            const fresh = await loadProgress(activeStorageKey);
            setProgress(fresh);
          },
        },
      ],
    );
  };

  const handleToggleReview = async (service: string) => {
    if (!progress) return;
    const updated = toggleNeedsReview(progress, service);
    setProgress(updated);
    await saveProgress(updated, activeStorageKey);
  };

  const handleResetGuide = (guideId: string, service: string) => {
    Alert.alert(
      `Reset "${service}"`,
      "Clears section progress for this topic. Quiz history and flashcard status are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetGuideProgress(progress, guideId, service);
            setProgress(updated);
            await saveProgress(updated, activeStorageKey);
          },
        },
      ],
    );
  };

  const handleResetAllGuides = () => {
    Alert.alert(
      "Reset All Guides",
      "Clears section progress and completion status for every guide. Quiz history and flashcards are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllGuides(progress);
            setProgress(updated);
            await saveProgress(updated, activeStorageKey);
          },
        },
      ],
    );
  };

  const handleResetAllFlashcards = () => {
    Alert.alert(
      "Reset Flashcards",
      "Marks all flashcards as unseen. Quiz history and guide progress are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllFlashcards(progress);
            setProgress(updated);
            await saveProgress(updated, activeStorageKey);
          },
        },
      ],
    );
  };

  const handleResetAllQuizzes = () => {
    Alert.alert(
      "Reset Quiz History",
      "Clears all quiz history, domain scores, and weak topics. Guide progress and flashcards are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllQuizzes(progress);
            setProgress(updated);
            await saveProgress(updated, activeStorageKey);
          },
        },
      ],
    );
  };

  const handleResetDomain = (domain: Domain, label: string) => {
    Alert.alert(
      `Reset "${label}"`,
      "Clears quiz accuracy scores for this domain. Quiz history and other data are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetDomainScore(progress, domain);
            setProgress(updated);
            await saveProgress(updated, activeStorageKey);
          },
        },
      ],
    );
  };

  if (!progress) return null;

  const styles = makeStyles(colors);

  const topicsWithProgress = allGuides.filter(
    (g) => progress.guideProgress[g.id] !== undefined,
  );

  const overallAccuracy = isTopicMode
    ? 0
    : getExamReadiness(progress, certMeta, flashcards.length);
  const weakTopics = getSortedWeakTopics(progress);
  const knownCards = Object.values(progress.studiedCards).filter(
    (s) => s === "known",
  ).length;
  const learningCards = Object.values(progress.studiedCards).filter(
    (s) => s === "learning",
  ).length;
  const totalCards = flashcards.length;
  const unseenCards = totalCards - knownCards - learningCards;

  const recentHistory = progress.quizHistory.slice(0, 10);
  const guidesCompleted = getGuidesCompleted(progress);
  const guidesViewed = getGuidesViewed(progress);
  const totalGuides = allGuides.length;

  const readinessColor =
    overallAccuracy >= 80
      ? colors.correct
      : overallAccuracy >= 60
        ? colors.warning
        : colors.incorrect;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScreenHeader />
      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Your Progress</Text>

          {/* Readiness card — cert mode only */}
          {!isTopicMode && (
            <View
              style={[
                styles.readinessCard,
                { borderLeftColor: readinessColor },
              ]}
            >
              <Text style={[styles.readinessPct, { color: readinessColor }]}>
                {overallAccuracy}%
              </Text>
              <Text style={styles.readinessSub}>
                {overallAccuracy >= 80
                  ? "Ready to sit the exam!"
                  : overallAccuracy >= 60
                    ? "Getting close — keep going"
                    : "Keep studying — you'll get there"}
              </Text>
            </View>
          )}

          {/* Flashcard mastery */}
          <Text style={styles.sectionTitle}>Flashcard Mastery</Text>
          <View style={styles.masteryCard}>
            <View style={styles.masteryBar}>
              <View
                style={[
                  styles.masterySegment,
                  { flex: knownCards, backgroundColor: colors.correct },
                ]}
              />
              <View
                style={[
                  styles.masterySegment,
                  { flex: learningCards, backgroundColor: colors.warning },
                ]}
              />
              <View
                style={[
                  styles.masterySegment,
                  {
                    flex: Math.max(unseenCards, 0.01),
                    backgroundColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.masteryLegend}>
              <LegendDot
                color={colors.correct}
                label={`Known (${knownCards})`}
                colors={colors}
              />
              <LegendDot
                color={colors.warning}
                label={`Learning (${learningCards})`}
                colors={colors}
              />
              <LegendDot
                color={colors.border}
                label={`Unseen (${unseenCards})`}
                colors={colors}
              />
            </View>
            <Text style={styles.masteryTotal}>
              {knownCards} of {totalCards} cards mastered (
              {Math.round((knownCards / totalCards) * 100)}%)
            </Text>
          </View>

          {/* Guide progress */}
          <Text style={styles.sectionTitle}>Guide Progress</Text>
          <View style={styles.masteryCard}>
            <View style={styles.masteryBar}>
              <View
                style={[
                  styles.masterySegment,
                  { flex: guidesCompleted, backgroundColor: colors.correct },
                ]}
              />
              <View
                style={[
                  styles.masterySegment,
                  {
                    flex: Math.max(guidesViewed - guidesCompleted, 0),
                    backgroundColor: colors.warning,
                  },
                ]}
              />
              <View
                style={[
                  styles.masterySegment,
                  {
                    flex: Math.max(totalGuides - guidesViewed, 0.01),
                    backgroundColor: colors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.masteryLegend}>
              <LegendDot
                color={colors.correct}
                label={`Completed (${guidesCompleted})`}
                colors={colors}
              />
              <LegendDot
                color={colors.warning}
                label={`In progress (${guidesViewed - guidesCompleted})`}
                colors={colors}
              />
              <LegendDot
                color={colors.border}
                label={`Unread (${totalGuides - guidesViewed})`}
                colors={colors}
              />
            </View>
            <Text style={styles.masteryTotal}>
              {guidesCompleted} of {totalGuides} guides completed (
              {Math.round((guidesCompleted / totalGuides) * 100)}%)
            </Text>
          </View>

          {/* Domain accuracy — cert mode only */}
          {!isTopicMode && (
            <>
              <Text style={styles.sectionTitle}>Domain Accuracy</Text>
              {DOMAINS.map((domain) => {
                const meta = DOMAIN_META[domain];
                const acc = getDomainAccuracy(progress, domain);
                const { attempted, correct } = progress.domainScores[domain];
                const domainCards = flashcards.filter(
                  (c) => c.domain === domain,
                ).length;
                const domainKnown = Object.entries(
                  progress.studiedCards,
                ).filter(
                  ([id, status]) =>
                    status === "known" &&
                    flashcards.find((c) => c.id === id)?.domain === domain,
                ).length;

                return (
                  <View
                    key={domain}
                    style={[styles.domainCard, { borderLeftColor: meta.color }]}
                  >
                    <View style={styles.domainHeader}>
                      <Ionicons
                        name={meta.icon as any}
                        size={18}
                        color={meta.color}
                      />
                      <View style={styles.domainInfo}>
                        <Text style={styles.domainLabel}>{meta.label}</Text>
                        <Text style={styles.domainWeight}>
                          {meta.weight} of exam
                        </Text>
                      </View>
                      <View style={styles.domainScoreBox}>
                        <Text
                          style={[
                            styles.domainScore,
                            {
                              color:
                                attempted === 0
                                  ? colors.textMuted
                                  : acc >= 80
                                    ? colors.correct
                                    : acc >= 60
                                      ? colors.warning
                                      : colors.incorrect,
                            },
                          ]}
                        >
                          {attempted === 0 ? "–" : `${acc}%`}
                        </Text>
                        <Text style={styles.domainAttempted}>
                          {attempted === 0
                            ? "No quizzes yet"
                            : `${correct}/${attempted} correct`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.barRow}>
                      <Text style={styles.barLabel}>Quiz</Text>
                      <View style={styles.barBg}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${acc}%`,
                              backgroundColor:
                                acc >= 80
                                  ? colors.correct
                                  : acc >= 60
                                    ? colors.warning
                                    : colors.incorrect,
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.barRow}>
                      <Text style={styles.barLabel}>Cards</Text>
                      <View style={styles.barBg}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${Math.round((domainKnown / domainCards) * 100)}%`,
                              backgroundColor: meta.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barCount}>
                        {domainKnown}/{domainCards}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Weak Topics */}
          <Text style={styles.sectionTitle}>Weak Topics</Text>
          {weakTopics.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons
                name="checkmark-circle-outline"
                size={36}
                color={colors.textMuted}
              />
              <Text style={styles.emptyHistoryText}>
                No weak topics yet — take a quiz to get started
              </Text>
            </View>
          ) : (
            weakTopics.map((topic) => (
              <WeakTopicRow
                key={topic.service}
                topic={topic}
                colors={colors}
                onToggleReview={() => handleToggleReview(topic.service)}
                onPractice={() =>
                  navigation.navigate("Quiz", {
                    domain: "all",
                    difficulty: "all",
                    count: 10,
                    service: topic.service,
                  })
                }
              />
            ))
          )}

          {/* Quiz history */}
          <Text style={styles.sectionTitle}>Recent Quiz History</Text>
          {recentHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons
                name="trophy-outline"
                size={36}
                color={colors.textMuted}
              />
              <Text style={styles.emptyHistoryText}>No quizzes taken yet</Text>
            </View>
          ) : (
            recentHistory.map((attempt) => (
              <HistoryRow key={attempt.id} attempt={attempt} colors={colors} />
            ))
          )}

          {/* Stats summary */}
          <Text style={styles.sectionTitle}>All-Time Stats</Text>
          <View style={styles.statsGrid}>
            <MiniStat
              icon="help-circle"
              color={colors.primary}
              value={progress.totalQuestionsAnswered}
              label="Questions"
              colors={colors}
            />
            <MiniStat
              icon="checkmark-circle"
              color={colors.correct}
              value={progress.totalCorrect}
              label="Correct"
              colors={colors}
            />
            <MiniStat
              icon="trophy"
              color={colors.accent}
              value={progress.quizHistory.length}
              label="Quizzes"
              colors={colors}
            />
            <MiniStat
              icon="book"
              color={colors.warning}
              value={knownCards + learningCards}
              label="Cards Studied"
              colors={colors}
            />
            <MiniStat
              icon="library"
              color={colors.accent}
              value={guidesCompleted}
              label="Guides Done"
              colors={colors}
            />
          </View>

          {/* Reset */}
          {(() => {
            const studiedCardCount = knownCards + learningCards;
            const domainsWithAttempts = DOMAINS.filter(
              (d) => progress.domainScores[d].attempted > 0,
            );
            const hasAnyReset =
              studiedCardCount > 0 ||
              progress.quizHistory.length > 0 ||
              domainsWithAttempts.length > 0 ||
              topicsWithProgress.length > 0;

            if (!hasAnyReset) return null;

            return (
              <>
                <Text style={styles.sectionTitle}>Reset Progress</Text>

                {studiedCardCount > 0 && (
                  <ResetCategoryRow
                    label="Flashcards"
                    detail={`${studiedCardCount} of ${totalCards} studied`}
                    icon="layers-outline"
                    onReset={handleResetAllFlashcards}
                    colors={colors}
                  />
                )}

                {progress.quizHistory.length > 0 && (
                  <ResetCategoryRow
                    label="Quiz History"
                    detail={`${progress.quizHistory.length} quiz${progress.quizHistory.length !== 1 ? "zes" : ""} · ${progress.totalQuestionsAnswered} questions answered`}
                    icon="help-circle-outline"
                    onReset={handleResetAllQuizzes}
                    colors={colors}
                  />
                )}

                {domainsWithAttempts.length > 0 && (
                  <View style={styles.resetGroup}>
                    <View style={styles.resetGroupHeader}>
                      <Text style={styles.resetGroupLabel}>Domains</Text>
                      <Text style={styles.resetGroupSub}>
                        reset accuracy per domain
                      </Text>
                    </View>
                    {domainsWithAttempts.map((domain, di) => {
                      const meta = DOMAIN_META[domain];
                      const { attempted, correct } =
                        progress.domainScores[domain];
                      return (
                        <View
                          key={domain}
                          style={[
                            styles.groupRow,
                            di < domainsWithAttempts.length - 1 &&
                              styles.groupRowDivider,
                          ]}
                        >
                          <Ionicons
                            name={meta.icon as any}
                            size={14}
                            color={meta.color}
                          />
                          <View style={styles.topicResetInfo}>
                            <Text style={styles.topicResetName}>
                              {meta.label}
                            </Text>
                            <Text style={styles.topicResetMeta}>
                              {correct}/{attempted} correct
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.topicResetBtn}
                            onPress={() =>
                              handleResetDomain(domain, meta.label)
                            }
                          >
                            <Ionicons
                              name="refresh-outline"
                              size={14}
                              color={colors.incorrect}
                            />
                            <Text style={styles.topicResetBtnText}>Reset</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}

                {topicsWithProgress.length > 0 && (
                  <View style={styles.resetGroup}>
                    <View style={styles.resetGroupHeader}>
                      <Text style={styles.resetGroupLabel}>Guides</Text>
                      <View style={styles.resetGroupHeaderRight}>
                        <Text style={styles.resetGroupSub}>
                          reset per topic
                        </Text>
                        <TouchableOpacity onPress={handleResetAllGuides}>
                          <Text style={styles.resetAllLink}>Reset all</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {topicsWithProgress.map((g, gi) => {
                      const gp = progress.guideProgress[g.id];
                      const completed = gp?.completed ?? false;
                      const sectionsRead = gp?.sectionsRead.length ?? 0;
                      return (
                        <View
                          key={g.id}
                          style={[
                            styles.groupRow,
                            gi < topicsWithProgress.length - 1 &&
                              styles.groupRowDivider,
                          ]}
                        >
                          {completed && (
                            <Ionicons
                              name="checkmark-circle"
                              size={16}
                              color={colors.correct}
                            />
                          )}
                          <View style={styles.topicResetInfo}>
                            <Text style={styles.topicResetName}>
                              {g.service}
                            </Text>
                            <Text style={styles.topicResetMeta}>
                              {completed
                                ? "Completed"
                                : `${sectionsRead} section${sectionsRead !== 1 ? "s" : ""} read`}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.topicResetBtn}
                            onPress={() => handleResetGuide(g.id, g.service)}
                          >
                            <Ionicons
                              name="refresh-outline"
                              size={14}
                              color={colors.incorrect}
                            />
                            <Text style={styles.topicResetBtnText}>Reset</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
            );
          })()}

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="trash-outline" size={18} color={colors.incorrect} />
            <Text style={styles.resetBtnText}>Reset Everything</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}

function LegendDot({
  color,
  label,
  colors,
}: {
  color: string;
  label: string;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.legendDot}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function WeakTopicRow({
  topic,
  colors,
  onToggleReview,
  onPractice,
}: {
  topic: WeakTopic;
  colors: ThemeColors;
  onToggleReview: () => void;
  onPractice: () => void;
}) {
  const styles = makeStyles(colors);
  const lastMissed = new Date(topic.lastMissed).toLocaleDateString();
  return (
    <View
      style={[
        styles.weakTopicRow,
        topic.needsReview && styles.weakTopicRowFlagged,
      ]}
    >
      <View style={styles.weakTopicLeft}>
        <View style={styles.weakTopicHeader}>
          <Text style={styles.weakTopicService}>{topic.service}</Text>
          {topic.needsReview && (
            <View style={styles.reviewBadge}>
              <Ionicons name="flag" size={10} color={colors.warning} />
              <Text style={styles.reviewBadgeText}>Needs Review</Text>
            </View>
          )}
        </View>
        <Text style={styles.weakTopicMeta}>
          {topic.wrongCount} wrong answer{topic.wrongCount !== 1 ? "s" : ""} ·
          last missed {lastMissed}
        </Text>
      </View>
      <View style={styles.weakTopicActions}>
        <TouchableOpacity
          style={[
            styles.weakTopicBtn,
            topic.needsReview
              ? styles.weakTopicBtnActive
              : styles.weakTopicBtnInactive,
          ]}
          onPress={onToggleReview}
        >
          <Ionicons
            name={topic.needsReview ? "flag" : "flag-outline"}
            size={14}
            color={topic.needsReview ? colors.warning : colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.practiceBtn} onPress={onPractice}>
          <Text style={styles.practiceBtnText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HistoryRow({
  attempt,
  colors,
}: {
  attempt: QuizAttempt;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);
  const pct = Math.round((attempt.score / attempt.total) * 100);
  const passed = pct >= 72;
  const date = new Date(attempt.date);
  const meta = attempt.domain !== "all" ? DOMAIN_META[attempt.domain] : null;
  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <View
      style={[
        styles.historyRow,
        {
          borderLeftColor: passed ? colors.correct : colors.incorrect,
        },
      ]}
    >
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>
          {meta ? meta.label : "All Domains"} · {attempt.total} questions
        </Text>
        <Text style={styles.historySub}>
          {date.toLocaleDateString()} · {formatTime(attempt.timeSeconds)}
        </Text>
      </View>
      <Text
        style={[
          styles.historyScore,
          { color: passed ? colors.correct : colors.incorrect },
        ]}
      >
        {pct}%
      </Text>
    </View>
  );
}

function MiniStat({
  icon,
  color,
  value,
  label,
  colors,
}: {
  icon: string;
  color: string;
  value: number;
  label: string;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={[styles.miniStat, { borderBottomColor: color }]}>
      <Text style={[styles.miniStatValue, { fontVariant: ["tabular-nums"] }]}>
        {value}
      </Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function ResetCategoryRow({
  label,
  detail,
  icon,
  onReset,
  colors,
}: {
  label: string;
  detail: string;
  icon: string;
  onReset: () => void;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.topicResetRow}>
      <Ionicons name={icon as any} size={18} color={colors.textMuted} />
      <View style={styles.topicResetInfo}>
        <Text style={styles.topicResetName}>{label}</Text>
        <Text style={styles.topicResetMeta}>{detail}</Text>
      </View>
      <TouchableOpacity style={styles.topicResetBtn} onPress={onReset}>
        <Ionicons name="refresh-outline" size={14} color={colors.incorrect} />
        <Text style={styles.topicResetBtnText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { padding: spacing.md },

    title: {
      fontSize: fontSize.xxl,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
      marginBottom: spacing.md,
    },

    readinessCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderLeftWidth: ROUTE_LINE_WIDTH,
    },
    readinessPct: {
      fontSize: fontSize.xxxl,
      fontWeight: "900",
      fontVariant: ["tabular-nums"],
      lineHeight: fontSize.xxxl * 1.2,
    },
    readinessSub: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.textMuted,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },

    masteryCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    masteryBar: {
      flexDirection: "row",
      height: 6,
      borderRadius: radius.full,
      overflow: "hidden",
      gap: 2,
    },
    masterySegment: { borderRadius: radius.full },
    masteryLegend: { flexDirection: "row", gap: spacing.md },
    legendDot: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 8, height: 8, borderRadius: radius.full },
    legendLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
    masteryTotal: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: "center",
    },

    domainCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderLeftWidth: ROUTE_LINE_WIDTH,
      gap: spacing.sm,
    },
    domainHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    domainInfo: { flex: 1 },
    domainLabel: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    domainWeight: { fontSize: fontSize.xs, color: colors.textSecondary },
    domainScoreBox: { alignItems: "flex-end" },
    domainScore: {
      fontSize: fontSize.xl,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
    },
    domainAttempted: { fontSize: fontSize.xs, color: colors.textMuted },

    barRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    barLabel: {
      width: 32,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      fontWeight: "600",
    },
    barBg: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    barFill: { height: "100%", borderRadius: radius.full },
    barCount: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      minWidth: 36,
      textAlign: "right",
      fontVariant: ["tabular-nums"],
    },

    weakTopicRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    weakTopicRowFlagged: {},
    weakTopicLeft: { flex: 1, gap: 3 },
    weakTopicHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      flexWrap: "wrap",
    },
    weakTopicService: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    reviewBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      borderWidth: 1,
      borderColor: colors.warning,
      borderRadius: radius.sm,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    reviewBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.warning,
    },
    weakTopicMeta: { fontSize: fontSize.xs, color: colors.textSecondary },
    weakTopicActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    weakTopicBtn: {
      width: 32,
      height: 32,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
    },
    weakTopicBtnActive: {
      borderColor: colors.warning,
    },
    weakTopicBtnInactive: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    practiceBtn: {
      backgroundColor: colors.primary,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
    },
    practiceBtnText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.secondary,
    },

    emptyHistory: {
      alignItems: "center",
      paddingVertical: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    emptyHistoryText: { fontSize: fontSize.sm, color: colors.textMuted },

    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.xs,
      gap: spacing.sm,
      borderLeftWidth: 3,
    },
    historyInfo: { flex: 1 },
    historyTitle: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    historySub: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    historyScore: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
    },

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    miniStat: {
      width: "47%",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      alignItems: "center",
      gap: 4,
      borderBottomWidth: 3,
    },
    miniStatValue: {
      fontSize: fontSize.xl,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    miniStatLabel: { fontSize: fontSize.xs, color: colors.textSecondary },

    resetGroup: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: "hidden",
      marginBottom: spacing.sm,
    },
    resetGroupHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.rule,
    },
    resetGroupLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    resetGroupHeaderRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    resetGroupSub: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
    resetAllLink: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.incorrect,
    },
    groupRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      gap: spacing.sm,
    },
    groupRowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.rule,
    },
    topicResetRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    topicResetInfo: { flex: 1 },
    topicResetName: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    topicResetMeta: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 2,
    },
    topicResetBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
      borderColor: colors.incorrect + "55",
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
    },
    topicResetBtnText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.incorrect,
    },
    resetBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.rule,
    },
    resetBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.incorrect,
    },
  });
}
