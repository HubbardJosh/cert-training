import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { spacing, radius } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { RootStackParamList } from "../navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Inline settings + switch buttons for embedding inside an existing header row. */
export function ScreenHeaderButtons() {
  const { colors } = useTheme();
  const { isDesktop } = useBreakpoint();
  const navigation = useNavigation<Nav>();

  if (isDesktop) return null;

  return (
    <View style={styles.btnRow}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Settings")}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("CertSelect")}
        activeOpacity={0.7}
      >
        <Ionicons name="swap-horizontal" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

/** Full-width header bar with buttons flush right — use on screens without their own header row. */
export default function ScreenHeader() {
  const { isDesktop } = useBreakpoint();

  if (isDesktop) return null;

  return (
    <View style={styles.bar}>
      <ScreenHeaderButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  btnRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
