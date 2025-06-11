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

type FontWeight =
  | "bold"
  | "400"
  | "600"
  | "normal"
  | "100"
  | "200"
  | "300"
  | "500"
  | "700"
  | "800"
  | "900";

export interface ThemeModelTypography {
  heading: {
    fontSize: number;
    fontWeight: FontWeight;
    color: string;
  };
  body: {
    fontSize: number;
    fontWeight: FontWeight;
    color: string;
  };
  small: {
    fontSize: number;
    fontWeight: FontWeight;
    color: string;
  };
  button: {
    fontSize: number;
    fontWeight: FontWeight;
    color: string;
  };
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
