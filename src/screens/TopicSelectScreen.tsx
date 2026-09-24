import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { spacing, radius, fontSize, ThemeColors } from "../utils/theme";
import { useTopic, TOPIC_META, TopicMeta } from "../context/TopicContext";
import { RootStackParamList } from "../navigation";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface TopicGroup {
  category: string;
  topics: TopicMeta[];
}

function buildGroups(): TopicGroup[] {
  const byCategory: Record<string, TopicMeta[]> = {};
  for (const meta of Object.values(TOPIC_META)) {
    if (!byCategory[meta.category]) byCategory[meta.category] = [];
    byCategory[meta.category].push(meta);
  }
  return Object.entries(byCategory).map(([category, topics]) => ({
    category,
    topics,
  }));
}

const GROUPS = buildGroups();

export default function TopicSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { topicId, setTopic } = useTopic();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const handleSelect = (id: string) => {
    setTopic(id);
    navigation.navigate("Tabs");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={colors.primary} />
            <Text style={[styles.backLabel, { color: colors.primary }]}>
              Back
            </Text>
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <Ionicons name="telescope" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Deep-Dive Topics</Text>
          <Text style={styles.subtitle}>
            Focused study on specific services and technologies — beyond the
            certification curriculum
          </Text>
        </View>

        {GROUPS.map((group) => (
          <View key={group.category} style={styles.group}>
            <View
              style={[styles.groupHeader, { borderLeftColor: colors.primary }]}
            >
              <Text style={[styles.groupCategory, { color: colors.primary }]}>
                {group.category.toUpperCase()}
              </Text>
            </View>

            {group.topics.map((topic) => {
              const active = topicId === topic.id;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.card,
                    active && {
                      borderColor: topic.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => handleSelect(topic.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: topic.color + "22" },
                    ]}
                  >
                    <Ionicons
                      name={topic.icon as any}
                      size={28}
                      color={topic.color}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <View style={styles.cardTitleRow}>
                      <Text style={[styles.topicName, { color: topic.color }]}>
                        {topic.name}
                      </Text>
                      {active && (
                        <View
                          style={[
                            styles.activeBadge,
                            { backgroundColor: topic.color + "22" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.activeBadgeText,
                              { color: topic.color },
                            ]}
                          >
                            Active
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.topicFullName}>{topic.fullName}</Text>
                    <Text style={styles.topicTagline}>{topic.tagline}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={active ? topic.color : colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.footer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textMuted}
          />
          <Text style={styles.footerText}>
            Topic progress is tracked independently from certification progress.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: {
      padding: spacing.lg,
      paddingTop: spacing.xl,
    },

    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    backRow: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginBottom: spacing.md,
      gap: 2,
    },
    backLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
    },
    logoWrap: {
      width: 72,
      height: 72,
      borderRadius: radius.xl,
      backgroundColor: colors.primary + "18",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },

    group: {
      marginBottom: spacing.lg,
    },
    groupHeader: {
      marginBottom: spacing.sm,
      borderLeftWidth: 3,
      paddingLeft: spacing.sm,
    },
    groupCategory: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      letterSpacing: 1,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    cardText: { flex: 1, gap: 3 },
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    topicName: {
      fontSize: fontSize.lg,
      fontWeight: "800",
    },
    activeBadge: {
      borderRadius: radius.full,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    activeBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
    topicFullName: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    topicTagline: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 1,
      lineHeight: 16,
    },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      justifyContent: "center",
      marginTop: spacing.sm,
      paddingBottom: spacing.lg,
    },
    footerText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
  });
}
