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
import { spacing, radius, fontSize, ThemeColors } from "../utils/theme";
import { loadProgress } from "../utils/storage";
import { UserProgress } from "../types";
import { RootStackParamList } from "../navigation";
import { useTopic } from "../context/TopicContext";
import { useTopicData } from "../context/useTopicData";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function TopicHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { topicMeta } = useTopic();
  const topicData = useTopicData();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const storageKey = topicMeta?.storageKey ?? "";

  useFocusEffect(
    useCallback(() => {
      if (storageKey) loadProgress(storageKey).then(setProgress);
    }, [storageKey]),
  );

  if (!topicMeta || !topicData) return null;

  const { guides, flashcards, quizQuestions } = topicData;
  const accentColor = topicMeta.color;

  const totalStudied = progress
    ? Object.values(progress.studiedCards).filter((s) => s === "known").length
    : 0;
  const guidesViewed = progress
    ? Object.values(progress.guideProgress).filter((g) => g.completed).length
    : 0;
  const quizAttempts = progress ? progress.quizHistory.length : 0;

  const lastScore =
    progress && progress.quizHistory.length > 0
      ? Math.round(
          (progress.quizHistory[progress.quizHistory.length - 1].score /
            progress.quizHistory[progress.quizHistory.length - 1].total) *
            100,
        )
      : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.topicName, { color: accentColor }]}>
                {topicMeta.name}
              </Text>
              <Text style={styles.topicFull}>{topicMeta.fullName}</Text>
            </View>
            <TouchableOpacity
              style={styles.badge}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.badge, { marginLeft: spacing.xs }]}
              onPress={() => navigation.navigate("TopicSelect")}
            >
              <Ionicons
                name="swap-horizontal"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Tagline banner */}
          <View
            style={[styles.banner, { backgroundColor: accentColor + "18" }]}
          >
            <Ionicons name="telescope" size={18} color={accentColor} />
            <Text style={[styles.bannerText, { color: accentColor }]}>
              {topicMeta.tagline}
            </Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatCard
              icon="book-outline"
              color={accentColor}
              label="Cards Mastered"
              value={`${totalStudied}/${flashcards.length}`}
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
              value={lastScore !== null ? `${lastScore}%` : "–"}
              colors={colors}
            />
          </View>

          {/* Quick start */}
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[
                styles.quickCard,
                { backgroundColor: accentColor + "18" },
              ]}
              onPress={() =>
                navigation.navigate("FlashCard", {
                  domain: "all",
                  difficulty: "all",
                })
              }
            >
              <Ionicons name="book" size={28} color={accentColor} />
              <Text style={styles.quickLabel}>Study Flashcards</Text>
              <Text style={styles.quickSub}>
                {flashcards.length} cards · all topics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickCard,
                { backgroundColor: colors.primary + "18" },
              ]}
              onPress={() =>
                navigation.navigate("Quiz", {
                  domain: "all",
                  difficulty: "all",
                  count: Math.min(20, quizQuestions.length),
                })
              }
            >
              <Ionicons name="timer" size={28} color={colors.primary} />
              <Text style={styles.quickLabel}>Practice Quiz</Text>
              <Text style={styles.quickSub}>
                {Math.min(20, quizQuestions.length)} questions · timed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guides list */}
          <Text style={styles.sectionTitle}>
            Study Guides ({guides.length})
          </Text>
          {guides.map((guide) => {
            const gProgress = progress?.guideProgress?.[guide.id];
            const completed = gProgress?.completed ?? false;
            const viewed = !!gProgress;
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
                    {guide.sections.length} sections · {guide.keyFacts.length}{" "}
                    key facts · {guide.examTips.length} exam tips
                  </Text>
                </View>
                <View style={styles.guideStatus}>
                  {completed ? (
                    <Text
                      style={[styles.statusText, { color: colors.correct }]}
                    >
                      Done
                    </Text>
                  ) : viewed ? (
                    <Text
                      style={[styles.statusText, { color: colors.warning }]}
                    >
                      In Progress
                    </Text>
                  ) : (
                    <Text
                      style={[styles.statusText, { color: colors.textMuted }]}
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

          {/* Quiz history */}
          {quizAttempts > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>
                Recent Quiz Attempts
              </Text>
              {progress!.quizHistory
                .slice(-3)
                .reverse()
                .map((attempt) => {
                  const pct = Math.round((attempt.score / attempt.total) * 100);
                  const color =
                    pct >= 80
                      ? colors.correct
                      : pct >= 60
                        ? colors.warning
                        : colors.incorrect;
                  return (
                    <View key={attempt.id} style={styles.attemptRow}>
                      <Ionicons name="trophy-outline" size={16} color={color} />
                      <Text style={styles.attemptDate}>
                        {new Date(attempt.date).toLocaleDateString()}
                      </Text>
                      <Text style={styles.attemptScore}>
                        {attempt.score}/{attempt.total} questions
                      </Text>
                      <Text style={[styles.attemptPct, { color }]}>{pct}%</Text>
                    </View>
                  );
                })}
            </>
          )}

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

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { padding: spacing.md },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    topicName: {
      fontSize: fontSize.xxl,
      fontWeight: "800",
    },
    topicFull: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    badge: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.primary + "22",
      justifyContent: "center",
      alignItems: "center",
    },

    banner: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: radius.md,
      padding: spacing.sm + 4,
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    bannerText: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      flex: 1,
      lineHeight: 18,
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
    statusText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },

    attemptRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.sm + 4,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    attemptDate: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      flex: 1,
    },
    attemptScore: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    attemptPct: {
      fontSize: fontSize.md,
      fontWeight: "800",
    },
  });
}
