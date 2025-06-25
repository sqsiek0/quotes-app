import { render } from "@testing-library/react-native";
import AppQuoteCard from "../../components/AppQuoteCard";
import { ThemeProvider } from "../../hooks/useTheme";

describe("AppQuoteCard", () => {
  test("renders quote and author correctly", () => {
    const quote = "This is a test quote";
    const author = "Test Author";

    const { getByText } = render(
      <AppQuoteCard quote={quote} author={author} />,
      {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      }
    );

    expect(getByText(quote)).toBeTruthy();
    expect(getByText(`- ${author}`)).toBeTruthy();
  });
});
