import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AppThemeSwitcher from "../../components/AppThemeSwitcher";
import { ThemeProvider, useTheme } from "../../hooks/ThemeProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

function ReadMode() {
  const [, , , mode] = useTheme();
  return <>{mode}</>;
}

describe("AppThemeSwitcher", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(<AppThemeSwitcher />, { wrapper });
    expect(getByTestId("app-theme-switcher")).toBeTruthy();
  });

  test("toggles theme on press", async () => {
    const { getByTestId, getAllByTestId } = render(
      <>
        <AppThemeSwitcher />
        <ReadMode />
      </>,
      { wrapper }
    );

    expect(getAllByTestId("theme-switcher-sun").length).toBeGreaterThan(0);

    fireEvent.press(getByTestId("app-theme-switcher"));

    await waitFor(() => {
      expect(getAllByTestId("theme-switcher-moon").length).toBeGreaterThan(0);
    });
  });
});
