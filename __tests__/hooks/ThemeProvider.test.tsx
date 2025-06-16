import { renderHook } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from "../../hooks/ThemeProvider";
import { act } from "react";

describe("Tests for ThemeProvider", () => {
  test("throws error when useTheme is used without provider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });

  test("return initial theme data", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const [colors, typography, toggleTheme, mode] = result.current;

    expect(colors).toBeDefined();
    expect(typography).toBeDefined();
    expect(typeof toggleTheme).toBe("function");
    expect(mode).toBe("light");
  });

  test("toggles theme mode", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const [colors, typography, toggleTheme, mode] = result.current;

    expect(mode).toBe("light");

    act(() => {
      toggleTheme();
    });

    const [newColors, newTypography, newToggleTheme, newMode] = result.current;

    expect(newMode).toBe("dark");
    expect(newColors).not.toEqual(colors);
    expect(newTypography).not.toEqual(typography);
  });
});
