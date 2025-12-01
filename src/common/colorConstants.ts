export const colors = {
  light: {
    primary: {
      main: "#906aff",
      light: "#ac8fff",
      lighter: "#e8e8ff",
      dark: "#7a5ae0",
    },

    text: {
      primary1: "#121212",
      primary: "#333333",
      secondary: "#757575",
      disabled: "#888888",
      white: "#ffffff",
      gray: "#666666",
    },

    background: {
      white: "#ffffff",
      lightGray: "#f9f9f9",
      disabled: "#75757555",
      card: "#fdfefe",
      upload: "#f8f5ff",
      header: "#906aff",
    },

    border: {
      light: "#e0e0e0",
      primary: "#906aff",
      dashed: "#b08cff",
    },

    state: {
      hover: "rgba(144, 106, 255, 0.4)",
      disabled: "#f0f0f0",
      hoverLight: "rgba(0,0,0,0.04)",
      hoverLighter: "rgba(0,0,0,0.04)",
    },

    chart: {
      line: "#ff9430",
      tooltipBackground: "#ffffff",
      tooltipBorder: "#ccc",
      grid: "rgba(0,0,0,0.1)",
      activeDot: "#ac8fff",
    },

    status: {
      info: "#1976d2",
      success: "#47be4b",
      warning: "#f57c00",
      error: "#e12a2a",
      delete: "#d81b60",
    },

    shadow: {
      light: "rgba(0,0,0,0.1)",
      medium: "rgba(0,0,0,0.15)",
      dark: "rgba(0,0,0,0.25)",
      card: "rgba(0,0,0,0.15)",
      hover: "rgba(0,0,0,0.1)",
      cardHover: "rgba(0,0,0,0.2)",
    },

    overlay: {
      white70: "rgba(255,255,255,0.7)",
      white90: "rgba(255,255,255,0.9)",
      black04: "rgba(0,0,0,0.04)",
      black08: "rgba(0,0,0,0.08)",
      black30: "rgba(0,0,0,0.3)",
    },

    special: {
      currentOpeningsBg: "#f4f0ff",
      scrollbarThumb: "rgba(0,0,0,0.3)",
      uploadIcon: "#7b1fa2",
      placeholder: "#ccc",
      placeholderText: "#fff",
      completedProjectBg: "rgba(232, 245, 233, 0.7)",
      completedProjectHover: "rgba(200, 230, 201, 0.8)",
      couponSection: "#EEE9FF",
    },

    ui: {
      checkbox: "#906aff",
      chip: {
        background: "#906aff",
        text: "#ffffff",
        border: "#906aff",
      },
      button: {
        cancel: "#d81b60",
        delete: "#d81b1b",
        disabled: "#ccc",
      },
    },
  },

  dark: {
    primary: {
      main: "#906aff",
      light: "#ac8fff",
      lighter: "#2a2438",
      dark: "#7a5ae0",
    },

    text: {
      primary1: "#121212",
      primary: "#ffffff",
      secondary: "#a0a0a0",
      disabled: "#666666",
      white: "#ffffff",
      gray: "#b0b0b0",
    },

    background: {
      white: "#121212",
      lightGray: "#1e1e1e",
      disabled: "#2a2a2a",
      card: "#e0e0e0",
      upload: "#2a2438",
      header: "#906aff",
    },

    border: {
      light: "#333333",
      primary: "#906aff",
      dashed: "#b08cff",
    },

    state: {
      hover: "rgba(144, 106, 255, 0.3)",
      disabled: "#2a2a2a",
      hoverLight: "rgba(255,255,255,0.08)",
      hoverLighter: "rgba(255,255,255,0.04)",
    },

    chart: {
      line: "#ff9430",
      tooltipBackground: "#2a2a2a",
      tooltipBorder: "#444",
      grid: "rgba(255,255,255,0.1)",
      activeDot: "#ac8fff",
    },

    status: {
      info: "#64b5f6",
      success: "#81c784",
      warning: "#ffb74d",
      error: "#e57373",
      delete: "#d81b60",
    },

    shadow: {
      light: "rgba(0,0,0,0.3)",
      medium: "rgba(0,0,0,0.4)",
      dark: "rgba(0,0,0,0.5)",
      card: "rgba(0,0,0,0.3)",
      hover: "rgba(0,0,0,0.2)",
      cardHover: "rgba(0,0,0,0.4)",
    },

    overlay: {
      white70: "rgba(255,255,255,0.7)",
      white90: "rgba(255,255,255,0.9)",
      black04: "rgba(0,0,0,0.04)",
      black08: "rgba(0,0,0,0.08)",
      black30: "rgba(0,0,0,0.3)",
    },

    special: {
      currentOpeningsBg: "#2a2438",
      scrollbarThumb: "rgba(255,255,255,0.3)",
      uploadIcon: "#ba68c8",
      placeholder: "#555",
      placeholderText: "#fff",
      completedProjectBg: "rgba(76, 175, 80, 0.2)",
      completedProjectHover: "rgba(76, 175, 80, 0.3)",
      couponSection: "#2a2438",
    },
    ui: {
      checkbox: "#906aff",
      chip: {
        background: "#906aff",
        text: "#ffffff",
        border: "#906aff",
      },
      button: {
        cancel: "#d81b60",
        delete: "#d81b1b",
        disabled: "#555",
      },
    },
  },
} as const;

export type Colors = typeof colors.light;
export type ThemeMode = "light" | "dark";
