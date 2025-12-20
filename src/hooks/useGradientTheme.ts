import { useState, useCallback, useMemo } from "react";
import {
  gradients,
  gradientClasses,
  colorClasses,
  componentStyles,
} from "../utils/colors";

type GradientType = keyof typeof gradients;
type ColorVariant = "primary" | "secondary";

interface ThemeConfig {
  gradientType: GradientType;
  colorVariant: ColorVariant;
  isDarkMode: boolean;
}

export const useGradientTheme = (initialConfig?: Partial<ThemeConfig>) => {
  const [config, setConfig] = useState<ThemeConfig>({
    gradientType: "primary",
    colorVariant: "primary",
    isDarkMode: false,
    ...initialConfig,
  });

  // Setters
  const setGradientType = useCallback((type: GradientType) => {
    setConfig((prev) => ({ ...prev, gradientType: type }));
  }, []);

  const setColorVariant = useCallback((variant: ColorVariant) => {
    setConfig((prev) => ({ ...prev, colorVariant: variant }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setConfig((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  // Computed values
  const currentGradient = useMemo(
    () => ({
      css: gradients[config.gradientType],
      className:
        gradientClasses.background[
          config.gradientType as keyof typeof gradientClasses.background
        ],
    }),
    [config.gradientType]
  );

  const currentColors = useMemo(
    () => colorClasses[config.colorVariant],
    [config.colorVariant]
  );

  // Theme-aware component styles
  const themedStyles = useMemo(
    () => ({
      button: {
        primary: `${componentStyles.button.primary} ${
          config.isDarkMode ? "shadow-lg" : ""
        }`,
        outline: `${componentStyles.button.outline} ${
          config.isDarkMode ? "bg-gray-800 text-white" : ""
        }`,
        ghost: componentStyles.button.ghost,
      },
      card: {
        gradient: `${componentStyles.card.gradient} ${
          config.isDarkMode ? "shadow-2xl" : "shadow-lg"
        }`,
        default: `${
          config.isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } ${componentStyles.card.shadow}`,
      },
      input: {
        focus: `${componentStyles.input.focus} ${
          config.isDarkMode ? "bg-gray-800 text-white border-gray-600" : ""
        }`,
      },
    }),
    [config.isDarkMode]
  );

  // Utility functions
  const getButtonStyle = useCallback(
    (variant: "primary" | "outline" | "ghost" = "primary") => ({
      className: themedStyles.button[variant],
      style: variant === "primary" ? { background: currentGradient.css } : {},
    }),
    [themedStyles, currentGradient.css]
  );

  const getCardStyle = useCallback(
    (variant: "gradient" | "default" = "default") => ({
      className: themedStyles.card[variant],
      style: variant === "gradient" ? { background: currentGradient.css } : {},
    }),
    [themedStyles, currentGradient.css]
  );

  const getGradientProps = useCallback(
    () => ({
      style: { background: currentGradient.css },
      className: currentGradient.className,
    }),
    [currentGradient]
  );

  // CSS custom properties for dynamic theming
  const cssVariables = useMemo(
    () =>
      ({
        "--current-gradient": currentGradient.css,
        "--primary-color": colorClasses[config.colorVariant].text.replace(
          "text-",
          ""
        ),
        "--gradient-type": config.gradientType,
      } as React.CSSProperties),
    [currentGradient.css, config.colorVariant, config.gradientType]
  );

  return {
    // State
    config,

    // Setters
    setGradientType,
    setColorVariant,
    toggleDarkMode,

    // Computed values
    currentGradient,
    currentColors,
    themedStyles,
    cssVariables,

    // Utility functions
    getButtonStyle,
    getCardStyle,
    getGradientProps,

    // Constants for easy access
    gradients,
    gradientClasses,
    colorClasses,
    componentStyles,
  };
};

export default useGradientTheme;
