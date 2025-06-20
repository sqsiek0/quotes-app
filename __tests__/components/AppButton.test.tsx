import { fireEvent, render } from "@testing-library/react-native";
import AppButton from "../../components/AppButton";
import { ThemeProvider } from "../../hooks/ThemeProvider";
import { PropsWithChildren } from "react";
import { Platform } from "react-native";

describe("AppButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  test("renders correctly with default props", () => {
    const { getByTestId, getByText } = render(
      wrapper({
        children: <AppButton title="Click Me" onPress={jest.fn()} />,
      }),
    );

    expect(getByTestId("app-button-pressable")).toBeTruthy();
    expect(getByText("Click Me")).toBeTruthy();
  });

  test("onPress function is called when button is pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      wrapper({
        children: <AppButton title="Click Me" onPress={mockOnPress} />,
      }),
    );

    const button = getByTestId("app-button-pressable");
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  describe("renders depending on platform", () => {
    const originalPlatform = Platform.OS;

    afterEach(() => {
      Object.defineProperty(Platform, "OS", {
        value: originalPlatform,
      });
    });

    test("renders TouchableNativeFeedback on Android", () => {
      Object.defineProperty(Platform, "OS", {
        value: "android",
      });

      const { getByTestId } = render(
        wrapper({
          children: <AppButton title="Android Button" onPress={jest.fn()} />,
        }),
      );

      expect(getByTestId("app-button-pressable")).toBeTruthy();
    });

    test("renders TouchableOpacity on iOS", () => {
      Object.defineProperty(Platform, "OS", {
        value: "ios",
      });

      const { getByTestId } = render(
        wrapper({
          children: <AppButton title="iOS Button" onPress={jest.fn()} />,
        }),
      );

      expect(getByTestId("app-button-pressable")).toBeTruthy();
    });
  });
});
