import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Platform } from "react-native";
import { Text } from "react-native";
import { createTabBarIcon } from "../../../components/(tabs)/_layout/createTabBarIcon";
import { CustomTabBarButton } from "../../../components/(tabs)/_layout/CustomTabBarButton";

describe("Check if custom functions is working", () => {
  describe("createTabBarIcon", () => {
    test("renders House icon for 'index' route", () => {
      const Icon = createTabBarIcon("index");

      const { getByTestId } = render(
        <Icon focused={true} color="black" size={24} />
      );
      expect(getByTestId("house-icon")).toBeTruthy();
    });

    test("renders Heart icon for 'Favourites' route", () => {
      const Icon = createTabBarIcon("Favourites");

      const { getByTestId } = render(
        <Icon focused={true} color="black" size={24} />
      );
      expect(getByTestId("heart-icon")).toBeTruthy();
    });

    test("renders List icon for 'Quotes' route", () => {
      const Icon = createTabBarIcon("Quotes");

      const { getByTestId } = render(
        <Icon focused={true} color="black" size={24} />
      );
      expect(getByTestId("quotes-icon")).toBeTruthy();
    });

    test("returns null for unknown route", () => {
      const Icon = createTabBarIcon("unknown");
      const { toJSON } = render(<Icon focused={true} color="red" size={24} />);
      expect(toJSON()).toBeNull();
    });
  });

  describe("CustomTabBarButton", () => {
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

      const { getByText } = render(
        <CustomTabBarButton onPress={jest.fn()} style={{}}>
          <Text>Click me</Text>
        </CustomTabBarButton>
      );

      expect(getByText("Click me")).toBeTruthy();
    });

    test("renders TouchableOpacity on iOS", () => {
      Object.defineProperty(Platform, "OS", {
        value: "ios",
      });

      const { getByText } = render(
        <CustomTabBarButton onPress={jest.fn()} style={{}}>
          <Text>Click me</Text>
        </CustomTabBarButton>
      );

      expect(getByText("Click me")).toBeTruthy();
    });

    test("calls onPress when pressed", () => {
      Object.defineProperty(Platform, "OS", {
        value: "ios",
      });

      const handlePress = jest.fn();

      const { getByText } = render(
        <CustomTabBarButton onPress={handlePress} style={{}}>
          <Text>Click me</Text>
        </CustomTabBarButton>
      );

      fireEvent.press(getByText("Click me"));
      expect(handlePress).toHaveBeenCalled();
    });
  });
});
