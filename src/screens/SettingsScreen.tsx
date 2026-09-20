import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { VoiceQuality } from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { spacing, radius, fontSize, ThemeColors } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";
import { useSpeechContext, SPEECH_RATES } from "../context/SpeechContext";
import WebContainer from "../components/WebContainer";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { colors, isDark, themeMode, toggleTheme } = useTheme();
  const {
    selectedVoiceId,
    setSelectedVoiceId,
    speechRate,
    setSpeechRate,
    availableVoices,
    voicesLoaded,
    refreshVoices,
  } = useSpeechContext();
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const styles = makeStyles(colors);

  const handlePreview = (voice: Speech.Voice) => {
    Speech.stop();
    setPreviewingId(voice.identifier);
    Speech.speak("Amazon S3 stores objects in buckets.", {
      voice: voice.identifier,
      onDone: () => setPreviewingId(null),
      onStopped: () => setPreviewingId(null),
      onError: () => setPreviewingId(null),
    });
  };

  const handleSelect = async (id: string | null) => {
    Speech.stop();
    setPreviewingId(null);
    await setSelectedVoiceId(id);
  };

  const displayVoices = availableVoices
    .filter(
      (v) =>
        v.language.startsWith("en") &&
        !v.identifier.startsWith("com.apple.eloquence.") &&
        !v.identifier.startsWith("com.apple.speech.synthesis.voice."),
    )
    .sort((a, b) => {
      if (a.quality === b.quality) return a.name.localeCompare(b.name);
      return a.quality === VoiceQuality.Enhanced ? -1 : 1;
    });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <WebContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Appearance */}
          <Text
            style={[
              styles.sectionLabel,
              { marginTop: spacing.md, marginBottom: spacing.xs },
            ]}
          >
            Appearance
          </Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={toggleTheme}>
              <View style={styles.rowLeft}>
                <Ionicons
                  name={
                    themeMode === "system"
                      ? "phone-portrait-outline"
                      : isDark
                        ? "sunny-outline"
                        : "moon-outline"
                  }
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.rowLabel}>Theme</Text>
              </View>
              <Text style={styles.rowValue}>
                {themeMode === "system" ? "System" : isDark ? "Dark" : "Light"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Speed */}
          <Text
            style={[
              styles.sectionLabel,
              { marginTop: spacing.md, marginBottom: spacing.xs },
            ]}
          >
            Reading Speed
          </Text>
          <View style={styles.card}>
            <View style={styles.speedRow}>
              {SPEECH_RATES.map(({ label, value }) => {
                const active = speechRate === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.speedBtn,
                      active && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSpeechRate(value)}
                  >
                    <Text
                      style={[
                        styles.speedBtnText,
                        { color: active ? "#fff" : colors.textSecondary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Voice */}
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Text-to-Speech Voice</Text>
            <TouchableOpacity
              onPress={refreshVoices}
              disabled={!voicesLoaded}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={voicesLoaded ? colors.primary : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionHint}>
            {Platform.OS === "ios"
              ? "Enhanced voices sound more natural. Download them in Settings → Accessibility → Spoken Content → Voices, then tap Refresh."
              : "Higher quality voices can be downloaded in Settings → General Management → Language & Input → Text-to-Speech → Preferred Engine → Settings, then tap Refresh."}
          </Text>

          {!voicesLoaded ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>Loading voices…</Text>
            </View>
          ) : displayVoices.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>
                No English voices found on this device.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              {/* Default option */}
              <TouchableOpacity
                style={[
                  styles.voiceRow,
                  selectedVoiceId === null && styles.voiceRowSelected,
                ]}
                onPress={() => handleSelect(null)}
              >
                <View style={styles.voiceRowLeft}>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedVoiceId === null && {
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    {selectedVoiceId === null && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                  <View>
                    <Text style={styles.voiceName}>System Default</Text>
                    <Text style={styles.voiceLang}>Device default voice</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {displayVoices.map((voice, i) => {
                const isSelected = selectedVoiceId === voice.identifier;
                const isPreviewing = previewingId === voice.identifier;
                return (
                  <View key={voice.identifier}>
                    {i > 0 && <View style={styles.divider} />}
                    <TouchableOpacity
                      style={[
                        styles.voiceRow,
                        isSelected && styles.voiceRowSelected,
                      ]}
                      onPress={() => handleSelect(voice.identifier)}
                    >
                      <View style={styles.voiceRowLeft}>
                        <View
                          style={[
                            styles.radioOuter,
                            isSelected && { borderColor: colors.primary },
                          ]}
                        >
                          {isSelected && (
                            <View
                              style={[
                                styles.radioInner,
                                { backgroundColor: colors.primary },
                              ]}
                            />
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.voiceNameRow}>
                            <Text style={styles.voiceName} numberOfLines={1}>
                              {voice.name}
                            </Text>
                            {voice.quality === VoiceQuality.Enhanced && (
                              <View style={styles.enhancedBadge}>
                                <Text style={styles.enhancedBadgeText}>
                                  Enhanced
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.voiceLang}>{voice.language}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.previewBtn}
                        onPress={() =>
                          isPreviewing ? Speech.stop() : handlePreview(voice)
                        }
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name={
                            isPreviewing ? "stop-circle" : "play-circle-outline"
                          }
                          size={22}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 40 }} />
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
      gap: spacing.sm,
    },
    backBtn: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    scroll: { flex: 1 },
    content: { padding: spacing.md },

    speedRow: {
      flexDirection: "row",
      padding: spacing.sm,
      gap: spacing.xs,
    },
    speedBtn: {
      flex: 1,
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
    },
    speedBtnText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
    },
    sectionLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    sectionLabel: {
      fontSize: fontSize.xs,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.md,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    rowLabel: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    rowValue: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
    },

    loadingCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    loadingText: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
    },
    emptyText: {
      fontSize: fontSize.sm,
      color: colors.textMuted,
      padding: spacing.md,
    },

    voiceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.md,
    },
    voiceRowSelected: {
      backgroundColor: colors.primary + "0f",
    },
    voiceRowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      flex: 1,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: radius.full,
    },
    voiceNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      flexWrap: "wrap",
    },
    voiceName: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    voiceLang: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 1,
    },
    enhancedBadge: {
      backgroundColor: colors.primary + "22",
      borderRadius: radius.full,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    enhancedBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
    },
    sectionHint: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginBottom: spacing.xs,
      lineHeight: 16,
    },
    previewBtn: {
      padding: 2,
      flexShrink: 0,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: spacing.md + 20 + spacing.sm,
    },
  });
}
