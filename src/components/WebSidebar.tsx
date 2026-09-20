import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import {
  spacing,
  radius,
  fontSize,
  WEB_SIDEBAR_WIDTH,
  ThemeColors,
} from "../utils/theme";
import { useTheme } from "../context/ThemeContext";

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

export default function WebSidebar() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = makeStyles(colors);

  const activeRouteName = useNavigationState((state) => {
    const tabsRoute = state?.routes.find((r) => r.name === "Tabs");
    if (!tabsRoute || !("state" in tabsRoute) || !tabsRoute.state)
      return "Home";
    const tabState = tabsRoute.state as any;
    const activeTab = tabState.routes?.[tabState.index ?? 0];
    return activeTab?.name ?? "Home";
  });

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoArea}>
        <Ionicons name="cloud" size={28} color={colors.primary} />
        <Text style={styles.logoText}>AWS Study</Text>
      </View>

      <View style={styles.navItems}>
        {TAB_ITEMS.map(({ name, label, icon, activeIcon }) => {
          const active = activeRouteName === name;
          return (
            <TouchableOpacity
              key={name}
              style={[
                styles.navItem,
                active && { backgroundColor: colors.primary + "18" },
              ]}
              onPress={() => navigation.navigate("Tabs", { screen: name })}
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
          <Text style={styles.navLabel}>Switch Cert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    sidebar: {
      width: WEB_SIDEBAR_WIDTH,
      height: "100%",
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingVertical: spacing.lg,
      flexShrink: 0,
    },
    logoArea: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
    },
    logoText: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
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
