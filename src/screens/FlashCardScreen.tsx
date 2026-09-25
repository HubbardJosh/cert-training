import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
import { FlashCard, Domain, Difficulty, UserProgress } from "../types";
import { loadProgress, saveProgress } from "../utils/storage";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useActiveData, useActiveStorageKey } from "../context/useActiveData";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";

type Route = RouteProp<RootStackParamList, "FlashCard">;

const CARD_HEIGHT = 380;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashCardScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { domain, difficulty, service } = route.params;
  const { certMeta } = useCert();
  const activeStorageKey = useActiveStorageKey();
  const { flashcards } = useActiveData();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const DOMAIN_META = getDomainMeta(colors);

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionLearning, setSessionLearning] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const filtered = flashcards.filter((c) => {
      const domainMatch = domain === "all" || c.domain === (domain as Domain);
      const diffMatch =
        difficulty === "all" || c.difficulty === (difficulty as Difficulty);
      const serviceMatch = !service || c.service === service;
      return domainMatch && diffMatch && serviceMatch;
    });
    setCards(shuffle(filtered));
    loadProgress(activeStorageKey).then(setProgress);
  }, [domain, difficulty, activeStorageKey]);

  const currentCard = cards[index];

  const handleFlip = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setFlipped((f) => !f), 120);
  }, [fadeAnim]);

  const navigateCard = useCallback(
    (direction: "next" | "prev") => {
      const nextIndex = direction === "next" ? index + 1 : index - 1;
      if (nextIndex < 0 || nextIndex >= cards.length) return;

      const toValue = direction === "next" ? -width : width;
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction === "next" ? width : -width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      setFlipped(false);
      setIndex(nextIndex);
    },
    [index, cards.length, slideAnim, width],
  );

  const markCard = useCallback(
    async (status: "known" | "learning") => {
      if (!currentCard || !progress) return;

      const updated: UserProgress = {
        ...progress,
        studiedCards: {
          ...progress.studiedCards,
          [currentCard.id]: status,
        },
        lastStudied: new Date().toISOString(),
      };
      setProgress(updated);
      await saveProgress(updated, activeStorageKey);

      if (status === "known") setSessionKnown((n) => n + 1);
      else setSessionLearning((n) => n + 1);

      if (index < cards.length - 1) {
        navigateCard("next");
      }
    },
    [currentCard, progress, index, cards.length, navigateCard],
  );

  const styles = makeStyles(colors);

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Ionicons name="search" size={36} color={colors.textMuted} />
          <Text style={styles.emptyText}>No cards match these filters</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) return null;

  const meta = DOMAIN_META[currentCard.domain];
  const cardStatus = progress?.studiedCards[currentCard.id];
  const isLast = index === cards.length - 1;
  const progressPct = ((index + 1) / cards.length) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header — departure board style */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCount}>
            {index + 1}
            <Text style={styles.headerCountOf}> / {cards.length}</Text>
          </Text>
          <Text style={styles.headerDomain}>{service ?? meta.label}</Text>
        </View>
        <View style={styles.sessionStats}>
          <Text style={[styles.sessionStat, { color: colors.correct }]}>
            {sessionKnown}✓
          </Text>
          <Text style={[styles.sessionStat, { color: colors.warning }]}>
            {sessionLearning}↺
          </Text>
        </View>
      </View>

      <WebContainer style={{ flex: 1 }}>
        {/* Route progress strip */}
        <View style={styles.routeProgressBg}>
          <View
            style={[
              styles.routeProgressFill,
              {
                width: `${progressPct}%` as any,
                backgroundColor: meta.color,
              },
            ]}
          />
        </View>

        {/* Card */}
        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.cardSlide,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Animated.View style={[styles.cardInner, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={[styles.card, { borderLeftColor: meta.color }]}
                onPress={handleFlip}
                activeOpacity={0.97}
              >
                {!flipped ? (
                  <>
                    <View style={styles.cardTopRow}>
                      <View style={styles.cardBadgeRow}>
                        <View
                          style={[
                            styles.domainBadge,
                            { borderColor: meta.color },
                          ]}
                        >
                          <View
                            style={[
                              styles.domainDot,
                              { backgroundColor: meta.color },
                            ]}
                          />
                          <Text
                            style={[
                              styles.domainBadgeText,
                              { color: meta.color },
                            ]}
                          >
                            {currentCard.service}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.diffText,
                            {
                              color:
                                currentCard.difficulty === "easy"
                                  ? colors.easy
                                  : currentCard.difficulty === "medium"
                                    ? colors.medium
                                    : colors.hard,
                            },
                          ]}
                        >
                          {currentCard.difficulty}
                        </Text>
                      </View>
                      {cardStatus && (
                        <Text
                          style={[
                            styles.statusChip,
                            {
                              color:
                                cardStatus === "known"
                                  ? colors.correct
                                  : colors.warning,
                            },
                          ]}
                        >
                          {cardStatus === "known" ? "Known" : "Learning"}
                        </Text>
                      )}
                    </View>

                    <View style={styles.cardBody}>
                      <AbbreviatedText
                        text={currentCard.question}
                        style={styles.questionText}
                        center
                      />
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.hintText}>Tap to reveal answer</Text>
                    </View>
                  </>
                ) : (
                  <ScrollView
                    contentContainerStyle={styles.backContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.cardTopRow}>
                      <Text style={styles.answerLabel}>ANSWER</Text>
                      <Text
                        style={[styles.domainBadgeText, { color: meta.color }]}
                      >
                        {currentCard.service}
                      </Text>
                    </View>

                    <AbbreviatedText
                      text={currentCard.answer}
                      style={styles.answerText}
                    />

                    <View style={styles.keyPointsSection}>
                      <Text style={styles.keyPointsLabel}>KEY POINTS</Text>
                      {currentCard.keyPoints.map((pt, i) => (
                        <View key={i} style={styles.keyPoint}>
                          <View
                            style={[
                              styles.keyBullet,
                              { backgroundColor: meta.color },
                            ]}
                          />
                          <AbbreviatedText
                            text={pt}
                            style={styles.keyPointText}
                          />
                        </View>
                      ))}
                    </View>

                    <View style={styles.tagRow}>
                      {currentCard.tags.map((tag) => (
                        <View key={tag} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </WebContainer>

      {/* Controls */}
      <View style={styles.controls}>
        {flipped ? (
          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[styles.ratingBtn, { borderColor: colors.warning }]}
              onPress={() => markCard("learning")}
            >
              <Text style={[styles.ratingBtnText, { color: colors.warning }]}>
                Still Learning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ratingBtn,
                {
                  borderColor: colors.correct,
                  backgroundColor: colors.correct,
                },
              ]}
              onPress={() => markCard("known")}
            >
              <Text style={[styles.ratingBtnText, { color: colors.surface }]}>
                Got It
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
              onPress={() => navigateCard("prev")}
              disabled={index === 0}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={index === 0 ? colors.textMuted : colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.flipBtn, { backgroundColor: meta.color }]}
              onPress={handleFlip}
            >
              <Text style={styles.flipBtnText}>Show Answer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, isLast && styles.navBtnDisabled]}
              onPress={() => navigateCard("next")}
              disabled={isLast}
            >
              <Ionicons
                name="arrow-forward"
                size={22}
                color={isLast ? colors.textMuted : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        )}

        {isLast && flipped && (
          <TouchableOpacity
            style={[styles.doneBtn, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneBtnText}>
              Done · {sessionKnown} known · {sessionLearning} learning
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

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
    },
    headerBtn: { padding: spacing.xs },
    headerCenter: { flex: 1, alignItems: "center" },
    headerCount: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
      fontVariant: ["tabular-nums"],
    },
    headerCountOf: {
      fontSize: fontSize.md,
      fontWeight: "400",
      color: colors.textMuted,
    },
    headerDomain: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    sessionStats: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    sessionStat: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    routeProgressBg: {
      height: ROUTE_LINE_WIDTH,
      backgroundColor: colors.rule,
      marginHorizontal: spacing.md,
      marginTop: spacing.sm,
      borderRadius: 2,
      overflow: "hidden",
    },
    routeProgressFill: {
      height: "100%" as any,
      borderRadius: 2,
    },

    cardContainer: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      justifyContent: "center",
    },
    cardSlide: { height: CARD_HEIGHT },
    cardInner: { flex: 1 },

    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: ROUTE_LINE_WIDTH,
      overflow: "hidden",
    },

    cardTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      paddingBottom: spacing.sm,
    },
    cardBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    domainBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
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
    },
    diffText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statusChip: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },

    cardBody: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    questionText: {
      fontSize: fontSize.lg,
      fontWeight: "600",
      color: colors.textPrimary,
      textAlign: "center",
      lineHeight: 26,
    },

    cardFooter: {
      alignItems: "center",
      paddingBottom: spacing.md,
    },
    hintText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      letterSpacing: 0.3,
    },

    backContent: { padding: spacing.md, paddingBottom: spacing.lg },
    answerLabel: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      color: colors.textMuted,
      letterSpacing: 1.5,
    },
    answerText: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      lineHeight: 24,
      marginVertical: spacing.md,
    },
    keyPointsSection: { marginBottom: spacing.md },
    keyPointsLabel: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      color: colors.textMuted,
      letterSpacing: 1.5,
      marginBottom: spacing.sm,
    },
    keyPoint: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
      gap: spacing.sm,
    },
    keyBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 7,
    },
    keyPointText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    tag: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tagText: { fontSize: fontSize.xs, color: colors.textMuted },

    controls: {
      padding: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.rule,
    },
    navRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    navBtnDisabled: { opacity: 0.3 },
    flipBtn: {
      flex: 1,
      marginHorizontal: spacing.sm,
      alignItems: "center",
      paddingVertical: spacing.sm + 4,
      borderRadius: radius.sm,
    },
    flipBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    ratingRow: { flexDirection: "row", gap: spacing.sm },
    ratingBtn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.md,
      borderWidth: 1.5,
      borderRadius: radius.sm,
    },
    ratingBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
    },

    doneBtn: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm + 2,
      borderWidth: 1,
      borderRadius: radius.sm,
    },
    doneBtnText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.md,
    },
    emptyText: { fontSize: fontSize.lg, color: colors.textMuted },
    backBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    backBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
    },
  });
}
