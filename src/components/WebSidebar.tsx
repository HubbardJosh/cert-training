import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  WEB_SIDEBAR_WIDTH,
  ThemeColors,
  ROUTE_LINE_WIDTH,
} from "../utils/theme";
import { useTheme } from "../context/ThemeContext";
import { useCert } from "../context/CertContext";
import { useTopic } from "../context/TopicContext";
import { RootStackParamList } from "../navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type TabName = "Home" | "Study" | "Guides" | "QuizMenu" | "Progress";

const TAB_ITEMS: {
  name: TabName;
  label: string;
  icon: string;
  activeIcon: string;
}[] = [
  {
    name: "Home",
    label: "Dashboard",
    icon: "home-outline",
    activeIcon: "home",
  },
  { name: "Study", label: "Study", icon: "book-outline", activeIcon: "book" },
  {
    name: "Guides",
    label: "Guides",
    icon: "library-outline",
    activeIcon: "library",
  },
  {
    name: "QuizMenu",
    label: "Quiz",
    icon: "trophy-outline",
    activeIcon: "trophy",
  },
  {
    name: "Progress",
    label: "Progress",
    icon: "bar-chart-outline",
    activeIcon: "bar-chart",
  },
];

interface Props {
  tabProps: BottomTabBarProps;
}

export default function WebSidebar({ tabProps }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const styles = makeStyles(colors);
  const { certMeta } = useCert();
  const { topicId, topicMeta } = useTopic();
  const isTopicMode = topicId !== null;

  const activeRouteName =
    tabProps.state.routes[tabProps.state.index]?.name ?? "Home";

  const accentColor = isTopicMode ? topicMeta!.color : certMeta.color;
  const displayName = isTopicMode ? topicMeta!.name : certMeta.name;
  const displaySub = isTopicMode ? topicMeta!.fullName : certMeta.fullName;
  const displayIcon = isTopicMode ? topicMeta!.icon : certMeta.icon;

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity
        style={styles.logoArea}
        onPress={() => navigation.navigate("CertSelect")}
        activeOpacity={0.8}
      >
        <View style={[styles.logoIcon, { borderColor: accentColor }]}>
          <Ionicons name={displayIcon as any} size={22} color={accentColor} />
        </View>
        <View style={styles.logoText}>
          <Text
            style={[styles.logoName, { color: accentColor }]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text style={styles.logoSub} numberOfLines={1}>
            {displaySub}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.navItems}>
        {TAB_ITEMS.map(({ name, label, icon, activeIcon }) => {
          const active = activeRouteName === name;
          return (
            <TouchableOpacity
              key={name}
              style={[
                styles.navItem,
                active && {
                  borderLeftWidth: ROUTE_LINE_WIDTH,
                  borderLeftColor: colors.primary,
                },
              ]}
              onPress={() => tabProps.navigation.navigate(name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={(active ? activeIcon : icon) as any}
                size={20}
                color={active ? colors.primary : colors.textMuted}
              />
              <Text
                style={[styles.navLabel, active && { color: colors.primary }]}
              >
                {label}
              </Text>
              {active && (
                <View
                  style={[
                    styles.activeBar,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomItems}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={colors.textMuted}
          />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("CertSelect")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={20}
            color={colors.textMuted}
          />
          <Text style={styles.navLabel}>Switch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    sidebar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: WEB_SIDEBAR_WIDTH,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingVertical: spacing.lg,
      zIndex: 10,
    },
    logoArea: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
    },
    logoIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.sm,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    logoText: {
      flex: 1,
      gap: 1,
    },
    logoName: {
      fontSize: fontSize.sm,
      fontWeight: "800",
    },
    logoSub: {
      fontSize: 10,
      color: colors.textMuted,
      lineHeight: 13,
    },
    navItems: {
      flex: 1,
      gap: 2,
    },
    navItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.md,
      marginHorizontal: spacing.sm,
      position: "relative",
    },
    navLabel: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textMuted,
      flex: 1,
    },
    activeBar: {
      position: "absolute",
      right: 0,
      top: "20%",
      bottom: "20%",
      width: 3,
      borderRadius: radius.full,
    },
    bottomItems: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      gap: 2,
    },
  });
}
