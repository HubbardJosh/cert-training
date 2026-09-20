import { Platform, useWindowDimensions } from "react-native";
import { DESKTOP_BREAKPOINT } from "../utils/theme";

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  return { width, isDesktop };
}
