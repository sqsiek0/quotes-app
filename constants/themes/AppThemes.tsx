import { TextStyle } from "react-native";
import { darkColors, lightColors } from "../colors/AppColors";
import { typographyDark, typographyLight } from "../fonts/AppFonts";

export interface ThemeModel {
  mode: "light" | "dark";
  colors: ThemeModelColors;
  typography: ThemeModelTypography;
}

export interface ThemeModelColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  accent: string;
  danger: string;
  border: string;
}

export interface ThemeModelTypography {
  heading: TextStyle;
  headerBody: TextStyle;
  body: TextStyle;
  small: TextStyle;
  button: TextStyle;
}

export const lightTheme: ThemeModel = {
  mode: "light",
  colors: lightColors,
  typography: typographyLight,
};

export const darkTheme: ThemeModel = {
  mode: "dark",
  colors: darkColors,
  typography: typographyDark,
};
