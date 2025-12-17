import { Moon, Sun, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "light" ? "Dark mode" : "Light mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function ContrastToggle() {
  const { contrastMode, toggleContrast } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={contrastMode === "high" ? "default" : "ghost"}
          size="icon"
          onClick={toggleContrast}
          data-testid="button-contrast-toggle"
          aria-label={contrastMode === "high" ? "Switch to normal contrast" : "Switch to high contrast"}
        >
          <Eye className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{contrastMode === "high" ? "Normal contrast" : "High contrast"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
