import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { spacing, radius, fontSize, ThemeColors } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";
import WebContainer from "../components/WebContainer";
import { useCert } from "../context/CertContext";
import { useTopic } from "../context/TopicContext";
import { SOURCES } from "../data/sources";
import { sources as agentcoreSources } from "../data/topics/bedrock-agentcore/sources";
import { sources as amazonSqsSources } from "../data/topics/amazon-sqs/sources";
import { Source } from "../data/sources";

export default function SourcesScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { certId, certMeta } = useCert();
  const { topicId, topicMeta } = useTopic();
  const isTopicMode = topicId !== null;
  const styles = makeStyles(colors);

  const TOPIC_SOURCES: Record<string, Source[]> = {
    "bedrock-agentcore": agentcoreSources,
    "amazon-sqs": amazonSqsSources,
  };

  const activeSources: Source[] | undefined = isTopicMode
    ? TOPIC_SOURCES[topicId!]
    : SOURCES.find((s) => s.certId === certId)?.sources;

  const displayName = isTopicMode
    ? (topicMeta?.name ?? "Topic")
    : certMeta.name;
  const accentColor = isTopicMode
    ? (topicMeta?.color ?? colors.primary)
    : colors.primary;
  const noticeText = isTopicMode
    ? "All guide content and quiz questions for this topic are verified against the official documentation pages listed below."
    : "All guide content and quiz questions for this certification are verified against the official AWS documentation pages listed below.";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Sources</Text>
          <Text style={styles.subtitle}>{displayName}</Text>
        </View>
      </View>

      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.info}
            />
            <Text style={styles.noticeText}>{noticeText}</Text>
          </View>

          {activeSources && activeSources.length > 0 ? (
            activeSources.map((source, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={accentColor}
                  />
                  <Text style={styles.cardTitle}>{source.title}</Text>
                </View>

                <View style={styles.topicsContainer}>
                  {source.topics.map((topic, j) => (
                    <View key={j} style={styles.topicRow}>
                      <View
                        style={[
                          styles.topicDot,
                          { backgroundColor: accentColor },
                        ]}
                      />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.urlBtn}
                  onPress={() => Linking.openURL(source.url)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="open-outline" size={13} color={accentColor} />
                  <Text
                    style={[styles.urlText, { color: accentColor }]}
                    numberOfLines={1}
                  >
                    {source.url}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.empty}>
              <Ionicons
                name="library-outline"
                size={40}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>
                No sources listed yet for this certification.
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </WebContainer>
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
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: colors.primary + "18",
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    headerText: { flex: 1 },
    title: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 1,
    },

    scroll: { flex: 1 },
    content: { padding: spacing.md, gap: spacing.sm },

    notice: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.xs,
      backgroundColor: colors.info + "15",
      borderRadius: radius.md,
      padding: spacing.sm + 4,
      borderWidth: 1,
      borderColor: colors.info + "40",
      marginBottom: spacing.xs,
    },
    noticeText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.info,
      lineHeight: 20,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.sm,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.xs,
    },
    cardTitle: {
      flex: 1,
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
      lineHeight: 20,
    },

    topicsContainer: { gap: 6, paddingLeft: spacing.xs },
    topicRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.xs,
    },
    topicDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginTop: 7,
    },
    topicText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    urlBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    urlText: {
      flex: 1,
      fontSize: fontSize.xs,
      color: colors.primary,
      textDecorationLine: "underline",
    },

    empty: {
      alignItems: "center",
      paddingVertical: 48,
      gap: spacing.sm,
    },
    emptyText: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      textAlign: "center",
    },
  });
}
