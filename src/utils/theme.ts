export type ThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;

  development: string;
  security: string;
  deployment: string;
  troubleshooting: string;

  easy: string;
  medium: string;
  hard: string;

  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  rule: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  correct: string;
  incorrect: string;
  warning: string;
  info: string;
};

// Transit map world — cream ground, authentic metro line palette
export const lightColors: ThemeColors = {
  // Primary action: Tokyo Tozai blue (route line used for CTAs)
  primary: "#0066CC",
  primaryDark: "#004EA8",
  // Surface whites
  secondary: "#FFFFFF",
  secondaryLight: "#F5F2EC",
  // Tokyo Ginza orange as accent (separate from domain lines)
  accent: "#E96B18",

  // Domain route lines — authentic metro palettes
  development: "#0066CC", // Tokyo Tozai
  security: "#E60012", // Tokyo Marunouchi
  deployment: "#00A550", // Tokyo Chiyoda
  troubleshooting: "#9C27B0", // London Jubilee-violet

  // Difficulty — traffic-signal spectrum
  easy: "#00A550",
  medium: "#E96B18",
  hard: "#E60012",

  // Paper ground and surfaces
  background: "#F5F2EC",
  surface: "#FFFFFF",
  surfaceElevated: "#EDE9E1",
  border: "#C8C2B6",
  rule: "#DDD8D0",

  textPrimary: "#1A1410",
  textSecondary: "#5C5248",
  textMuted: "#9B9288",

  correct: "#00A550",
  incorrect: "#E60012",
  warning: "#E96B18",
  info: "#0066CC",
};

// Dark mode: night station — dark map board, route lines fully saturated
export const darkColors: ThemeColors = {
  primary: "#3D8EE8",
  primaryDark: "#1C6FCA",
  secondary: "#141820",
  secondaryLight: "#1E2535",
  accent: "#F07B2A",

  development: "#3D8EE8",
  security: "#FF3B3B",
  deployment: "#2DBD6E",
  troubleshooting: "#B565D6",

  easy: "#2DBD6E",
  medium: "#F07B2A",
  hard: "#FF3B3B",

  background: "#0E1118",
  surface: "#141820",
  surfaceElevated: "#1E2535",
  border: "#2A3347",
  rule: "#212838",

  textPrimary: "#EDE9E1",
  textSecondary: "#8FA3BF",
  textMuted: "#4A6080",

  correct: "#2DBD6E",
  incorrect: "#FF3B3B",
  warning: "#F07B2A",
  info: "#3D8EE8",
};

// Legacy export
export const colors = lightColors;

export const DOMAIN_META: Record<
  string,
  { label: string; color: string; weight: string; icon: string }
> = {
  development: {
    label: "Development",
    color: lightColors.development,
    weight: "32%",
    icon: "code-slash",
  },
  security: {
    label: "Security",
    color: lightColors.security,
    weight: "26%",
    icon: "shield-checkmark",
  },
  deployment: {
    label: "Deployment",
    color: lightColors.deployment,
    weight: "24%",
    icon: "rocket",
  },
  troubleshooting: {
    label: "Troubleshooting",
    color: lightColors.troubleshooting,
    weight: "18%",
    icon: "build",
  },
  services: {
    label: "Services",
    color: lightColors.accent,
    weight: "",
    icon: "cloud",
  },
  fundamentals: {
    label: "Fundamentals",
    color: lightColors.primary,
    weight: "",
    icon: "school",
  },
  applications: {
    label: "Applications",
    color: lightColors.accent,
    weight: "",
    icon: "layers",
  },
};

export function getDomainMeta(
  c: ThemeColors,
): Record<
  string,
  { label: string; color: string; weight: string; icon: string }
> {
  return {
    development: {
      label: "Development",
      color: c.development,
      weight: "32%",
      icon: "code-slash",
    },
    security: {
      label: "Security",
      color: c.security,
      weight: "26%",
      icon: "shield-checkmark",
    },
    deployment: {
      label: "Deployment",
      color: c.deployment,
      weight: "24%",
      icon: "rocket",
    },
    troubleshooting: {
      label: "Troubleshooting",
      color: c.troubleshooting,
      weight: "18%",
      icon: "build",
    },
    services: {
      label: "Services",
      color: c.accent,
      weight: "",
      icon: "cloud",
    },
    fundamentals: {
      label: "Fundamentals",
      color: c.primary,
      weight: "",
      icon: "school",
    },
    applications: {
      label: "Applications",
      color: c.accent,
      weight: "",
      icon: "layers",
    },
  };
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Transit map system constants
export const STATION_DOT_SIZE = 10;
export const ROUTE_LINE_WIDTH = 4;
export const TRANSFER_DOT_SIZE = 14;

export const WEB_MAX_WIDTH = 1100;
export const WEB_SIDEBAR_WIDTH = 220;
export const DESKTOP_BREAKPOINT = 768;
