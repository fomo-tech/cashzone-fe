// Color System Utilities - Gradient Theme from #E91E63 to #FF8C1A
export const colorSystem = {
  // Primary Colors (Pink)
  primary: {
    DEFAULT: "#E91E63",
    light: "#F48FB1",
    dark: "#AD1457",
  },

  // Secondary Colors (Orange)
  secondary: {
    DEFAULT: "#FF8C1A",
    light: "#FFB74D",
    dark: "#E65100",
  },

  // Gradient Colors
  gradient: {
    from: "#E91E63",
    to: "#FF8C1A",
  },
} as const;

// CSS Gradient Strings
export const gradients = {
  primary: "linear-gradient(135deg, #E91E63 0%, #FF8C1A 100%)",
  primaryReverse: "linear-gradient(135deg, #FF8C1A 0%, #E91E63 100%)",
  horizontal: "linear-gradient(90deg, #E91E63 0%, #FF8C1A 100%)",
  vertical: "linear-gradient(180deg, #E91E63 0%, #FF8C1A 100%)",
  radial: "radial-gradient(circle, #E91E63 0%, #FF8C1A 100%)",
} as const;

// Gradient Class Names for easy use in components
export const gradientClasses = {
  background: {
    primary: "bg-gradient-primary",
    reverse: "bg-gradient-primary-reverse",
    horizontal: "bg-gradient-horizontal",
    vertical: "bg-gradient-vertical",
    radial: "bg-gradient-radial",
  },
  text: {
    primary: "text-gradient-primary",
  },
  border: {
    primary: "border-gradient-primary",
  },
  shadow: {
    primary: "shadow-gradient",
  },
  button: {
    filled: "btn-gradient",
    outline: "btn-gradient-outline",
    hover: "hover-gradient",
  },
} as const;

// Tailwind Color Classes
export const colorClasses = {
  primary: {
    bg: "bg-primary",
    bgDark: "bg-primary-dark",
    bgLight: "bg-primary-light",
    text: "text-primary",
    textDark: "text-primary-dark",
    border: "border-primary",
    ring: "ring-primary",
    shadow: "shadow-primary",
  },
  secondary: {
    bg: "bg-secondary",
    bgDark: "bg-secondary-dark",
    bgLight: "bg-secondary-light",
    text: "text-secondary",
    border: "border-secondary",
    ring: "ring-secondary",
    shadow: "shadow-secondary",
  },
} as const;

// Helper functions
export const getGradientStyle = (type: keyof typeof gradients = "primary") => ({
  background: gradients[type],
});

export const getGradientClass = (
  type: keyof typeof gradientClasses.background = "primary"
) => gradientClasses.background[type];

// Button style utilities
export const buttonStyles = {
  gradient: {
    className: gradientClasses.button.filled,
    style: getGradientStyle("primary"),
  },
  gradientOutline: {
    className: gradientClasses.button.outline,
  },
  gradientHover: {
    className: `${colorClasses.primary.bg} ${gradientClasses.button.hover}`,
  },
} as const;

// Common component style combinations
export const componentStyles = {
  card: {
    gradient: `${gradientClasses.background.primary} text-white rounded-lg`,
    gradientBorder: `bg-white ${gradientClasses.border.primary} rounded-lg`,
    shadow: `bg-white ${gradientClasses.shadow.primary} rounded-lg`,
  },
  button: {
    primary: `${gradientClasses.button.filled} text-white`,
    outline: `${gradientClasses.button.outline}`,
    ghost: `${colorClasses.primary.text} hover:${colorClasses.primary.bg} hover:text-white transition-colors`,
  },
  input: {
    focus: `focus:${colorClasses.primary.ring} focus:ring-2 focus:ring-opacity-50`,
    gradient: `border-2 ${gradientClasses.border.primary} focus:outline-none`,
  },
  badge: {
    gradient: `${gradientClasses.background.primary} text-white px-3 py-1 rounded-full text-sm font-medium`,
    outline: `${gradientClasses.border.primary} ${colorClasses.primary.text} px-3 py-1 rounded-full text-sm font-medium`,
  },
} as const;

export default {
  colorSystem,
  gradients,
  gradientClasses,
  colorClasses,
  getGradientStyle,
  getGradientClass,
  buttonStyles,
  componentStyles,
};
