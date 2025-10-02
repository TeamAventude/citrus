import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../Button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      name={
        <div className="relative flex items-center justify-center">
          {/* Sun */}
          <Sun
            className="absolute h-5 w-5 transition-all duration-300
              rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
          />
          {/* Moon */}
          <Moon
            className="absolute h-5 w-5 transition-all duration-300
              rotate-90 scale-0 dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </div>
      }
    />
  );
}
