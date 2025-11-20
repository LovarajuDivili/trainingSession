import { useTheme } from "../context/ThemeContext";
import { colors } from "../common/colorConstants";

export const useThemeColors = () => {
  const { themeMode } = useTheme();
  return colors[themeMode];
};
