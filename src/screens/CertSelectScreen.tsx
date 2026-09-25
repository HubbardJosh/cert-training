import React, { useState } from "react";
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
import {
  spacing,
  radius,
  fontSize,
  ThemeColors,
  ROUTE_LINE_WIDTH,
} from "../utils/theme";
import {
  useCert,
  CertificationId,
  CERT_META,
  CertMeta,
} from "../context/CertContext";
import { useTopic } from "../context/TopicContext";
import { RootStackParamList } from "../navigation";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Provider = "aws" | "anthropic";

interface CertEntry {
  meta: CertMeta;
  prev?: string;
  next?: string;
}

interface CertGroup {
  level: string;
  description: string;
  certs: CertEntry[];
}

const AWS_GROUPS: CertGroup[] = [
  {
    level: "Foundational",
    description: "No prior cloud experience required",
    certs: [
      { meta: CERT_META["clf-c02"], next: "DVA-C02 / SAA-C03 / AIF-C01" },
    ],
  },
  {
    level: "Associate",
    description: "Recommended 1+ year of AWS experience",
    certs: [
      {
        meta: CERT_META["dva-c02"],
        prev: "CLF-C02",
        next: "DOP-C02 / SAP-C02",
      },
      {
        meta: CERT_META["saa-c03"],
        prev: "CLF-C02",
        next: "SAP-C02 / DOP-C02",
      },
    ],
  },
  {
    level: "Specialty",
    description: "Domain-specific expertise",
    certs: [
      {
        meta: CERT_META["aif-c01"],
        prev: "CLF-C02",
        next: "MLS-C01 / ANS-C01",
      },
      { meta: CERT_META["mls-c01"], prev: "AIF-C01" },
    ],
  },
];

const ANTHROPIC_GROUPS: CertGroup[] = [
  {
    level: "Foundational",
    description: "Core Claude AI operations knowledge",
    certs: [{ meta: CERT_META["ccao-f"], next: "CCDV-F / CCAR-F" }],
  },
];

const AWS_COLOR = "#E96B18";
const ANTHROPIC_COLOR = "#9C27B0";
const TOPICS_COLOR = "#0066CC";

export default function CertSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { certId, setCert } = useCert();
  const { setTopic } = useTopic();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [provider, setProvider] = useState<Provider | null>(null);

  const handleSelect = (id: CertificationId) => {
    setCert(id);
    setTopic(null);
    navigation.navigate("Tabs");
  };

  const groups = provider === "aws" ? AWS_GROUPS : ANTHROPIC_GROUPS;
  const providerColor = provider === "aws" ? AWS_COLOR : ANTHROPIC_COLOR;

  if (provider === null) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.pickerContent}>
          {/* System map header */}
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>CERTIFICATIONS</Text>
            <Text style={styles.mapSubtitle}>Select a provider group</Text>
          </View>

          <ProviderCard
            label="Amazon Web Services"
            sub="Cloud Practitioner · Developer · AI Practitioner · Machine Learning"
            icon="cloud"
            color={AWS_COLOR}
            colors={colors}
            onPress={() => setProvider("aws")}
          />
          <ProviderCard
            label="Anthropic"
            sub="Claude AI Operations · Foundations & beyond"
            icon="sparkles"
            color={ANTHROPIC_COLOR}
            colors={colors}
            onPress={() => setProvider("anthropic")}
          />
          <ProviderCard
            label="Deep-Dive Topics"
            sub="Focused study beyond the cert curriculum · Bedrock AgentCore"
            icon="telescope"
            color={TOPICS_COLOR}
            colors={colors}
            onPress={() => navigation.navigate("TopicSelect")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back nav */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => setProvider(null)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={providerColor} />
          <Text style={[styles.backLabel, { color: providerColor }]}>
            Certifications
          </Text>
        </TouchableOpacity>

        {/* Line header */}
        <View style={styles.lineHeader}>
          <View
            style={[styles.lineStrip, { backgroundColor: providerColor }]}
          />
          <View style={styles.lineHeaderText}>
            <Text style={styles.lineTitle}>
              {provider === "aws"
                ? "AWS Certifications"
                : "Anthropic Certifications"}
            </Text>
            <Text style={styles.lineSubtitle}>
              Choose a certification to study for
            </Text>
          </View>
        </View>

        {groups.map((group) => (
          <View key={group.level} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={[styles.groupLevel, { color: providerColor }]}>
                {group.level.toUpperCase()}
              </Text>
              <Text style={styles.groupDesc}>{group.description}</Text>
            </View>

            {group.certs.map(({ meta: cert, prev, next }) => {
              const active = certId === cert.id;
              return (
                <TouchableOpacity
                  key={cert.id}
                  style={[
                    styles.certCard,
                    active && {
                      borderLeftColor: cert.color,
                      borderLeftWidth: ROUTE_LINE_WIDTH,
                    },
                  ]}
                  onPress={() => handleSelect(cert.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.certCardLeft}>
                    <Text style={[styles.certCode, { color: cert.color }]}>
                      {cert.name}
                    </Text>
                    {active && (
                      <View
                        style={[
                          styles.activeBadge,
                          { borderColor: cert.color },
                        ]}
                      >
                        <View
                          style={[
                            styles.activeDot,
                            { backgroundColor: cert.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.activeBadgeText,
                            { color: cert.color },
                          ]}
                        >
                          Active
                        </Text>
                      </View>
                    )}
                    <Text style={styles.certName}>{cert.fullName}</Text>
                    <Text style={styles.examInfo}>{cert.examInfo}</Text>
                    {(prev || next) && (
                      <View style={styles.progressionStack}>
                        {prev && (
                          <Text style={styles.progressionText}>
                            <Text style={styles.progressionLabel}>from </Text>
                            {prev}
                          </Text>
                        )}
                        {next && (
                          <Text style={styles.progressionText}>
                            <Text style={styles.progressionLabel}>→ </Text>
                            {next}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={active ? cert.color : colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Progress is tracked separately for each certification.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProviderCard({
  label,
  sub,
  icon,
  color,
  colors,
  onPress,
}: {
  label: string;
  sub: string;
  icon: string;
  color: string;
  colors: ThemeColors;
  onPress: () => void;
}) {
  const styles = makeStyles(colors);
  return (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.providerStrip, { backgroundColor: color }]} />
      <View style={styles.providerBody}>
        <View style={styles.providerIconWrap}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <View style={styles.providerText}>
          <Text style={[styles.providerName, { color: colors.textPrimary }]}>
            {label}
          </Text>
          <Text style={styles.providerSub}>{sub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: { padding: spacing.lg },

    pickerContent: {
      flex: 1,
      padding: spacing.lg,
      paddingTop: spacing.xl,
      justifyContent: "center",
    },

    mapHeader: {
      marginBottom: spacing.xl,
    },
    mapTitle: {
      fontSize: fontSize.xxxl,
      fontWeight: "900",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    mapSubtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },

    providerCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
      overflow: "hidden",
    },
    providerStrip: {
      width: ROUTE_LINE_WIDTH,
    },
    providerBody: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.lg,
      gap: spacing.md,
    },
    providerIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    providerText: { flex: 1, gap: 3 },
    providerName: {
      fontSize: fontSize.md,
      fontWeight: "700",
    },
    providerSub: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    backRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      marginBottom: spacing.lg,
    },
    backLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
    },

    lineHeader: {
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    lineStrip: {
      width: ROUTE_LINE_WIDTH,
      borderRadius: 2,
    },
    lineHeaderText: { flex: 1 },
    lineTitle: {
      fontSize: fontSize.xxl,
      fontWeight: "800",
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    lineSubtitle: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },

    group: { marginBottom: spacing.lg },
    groupHeader: {
      marginBottom: spacing.sm,
      paddingBottom: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.rule,
    },
    groupLevel: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      letterSpacing: 1.5,
    },
    groupDesc: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 2,
    },

    certCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    certCardLeft: { flex: 1, gap: 3 },
    certCode: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      letterSpacing: -0.3,
    },
    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      marginBottom: 2,
    },
    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    activeBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
    certName: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    examInfo: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },
    progressionStack: {
      marginTop: spacing.xs,
      gap: 2,
    },
    progressionLabel: {
      color: colors.textMuted,
    },
    progressionText: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
    },

    footer: {
      paddingVertical: spacing.lg,
      alignItems: "center",
    },
    footerText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
  });
}
