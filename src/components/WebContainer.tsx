import React from "react";
import { View, StyleSheet } from "react-native";
import { WEB_MAX_WIDTH, WEB_SIDEBAR_WIDTH } from "../utils/theme";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function WebContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const { isDesktop } = useBreakpoint();

  if (!isDesktop) return <>{children}</>;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    marginLeft: WEB_SIDEBAR_WIDTH,
  },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: WEB_MAX_WIDTH,
  },
});
