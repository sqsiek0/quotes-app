jest.mock("../../../services/quotes/quotesService", () => ({
  fetchRandomQuote: jest.fn(() => new Promise(() => {})),
}));

jest.mock("../../../hooks/quotes/useRandomQuote", () => ({
  useRandomQuote: jest.fn(() => new Promise(() => {})),
}));

import { render } from "@testing-library/react-native";
import HomeScreen from "../../../app/(tabs)";
import { ThemeProvider } from "../../../hooks/ThemeProvider";
import { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from "@tanstack/react-query";
import { useRandomQuote } from "../../../hooks/quotes/useRandomQuote";
import { QuoteResponse } from "../../../types/Quotes";

let queryClient: QueryClient;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

beforeEach(() => {
  queryClient = createTestQueryClient();
  jest.clearAllMocks();
});

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
);

const renderHome = () => render(<HomeScreen />, { wrapper });

describe("index screen - home tab", () => {
  test("renders correctly", async () => {
    const { getByTestId } = renderHome();
    const homeScreen = getByTestId("home-screen-view");
    expect(homeScreen).toBeTruthy();
  });

  test("renders loading state", async () => {
    const mockResult = {
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
    } as UseQueryResult<QuoteResponse, Error>;

    jest.mocked(useRandomQuote).mockReturnValue(mockResult);

    const { getByTestId } = renderHome();

    const initialLoad = getByTestId("home-screen-initial-load");
    expect(initialLoad).toBeTruthy();
  });
});
