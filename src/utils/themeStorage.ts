import { ThemeName } from "../components/ThemeSwitcher";

export type ColorThemeVariant = "green" | "pink" | "yellow" | "rainbow";

const colorThemeVariants: ColorThemeVariant[] = [
  "green",
  "pink",
  "yellow",
  "rainbow",
];

export function getSavedTheme(): ThemeName {
  const savedTheme = localStorage.getItem("quiz-theme");

  if (savedTheme === "dark" || savedTheme === "color") {
    return savedTheme;
  }

  return "light";
}

export function getSavedColorThemeVariant(): ColorThemeVariant {
  const savedVariant = localStorage.getItem("quiz-color-theme");

  if (
    savedVariant === "green" ||
    savedVariant === "pink" ||
    savedVariant === "yellow" ||
    savedVariant === "rainbow"
  ) {
    return savedVariant;
  }

  return "pink";
}

export function getRandomColorThemeVariant(
  currentVariant: ColorThemeVariant,
) {
  const availableVariants = colorThemeVariants.filter(
    (variant) => variant !== currentVariant,
  );
  const randomIndex = Math.floor(Math.random() * availableVariants.length);

  return availableVariants[randomIndex];
}
