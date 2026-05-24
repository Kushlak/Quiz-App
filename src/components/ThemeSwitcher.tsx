export type ThemeName = "light" | "dark" | "color";

type Props = {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

const themes: { label: string; value: ThemeName }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Color", value: "color" },
];

function ThemeSwitcher({ theme, onThemeChange }: Props) {
  return (
    <div className="theme-switcher" aria-label="Theme switcher">
      {themes.map((option) => (
        <button
          key={option.value}
          className={`theme-option${theme === option.value ? " active-theme" : ""}`}
          type="button"
          aria-pressed={theme === option.value}
          onClick={() => onThemeChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
