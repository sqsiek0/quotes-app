jest.mock("../../../services/quotes/quotesService", () => ({
  fetchRandomQuote: jest.fn(() => new Promise(() => {})),
}));

jest.mock("../../../hooks/quotes/useRandomQuote", () => ({
  useRandomQuote: jest.fn(() => new Promise(() => {})),
}));

jest.mock("../../../hooks/useFavourites", () => ({
  StorageFavouritesProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useFavourites: jest.fn(() => ({
    state: { ids: [], byId: {} },
    toggle: jest.fn(),
    isFavourite: jest.fn(() => false),
  })),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../../../app/(tabs)";
import { ThemeProvider } from "../../../hooks/useTheme";
import { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryObserverResult,
  RefetchOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useRandomQuote } from "../../../hooks/quotes/useRandomQuote";
import { QuoteResponse } from "../../../types/Quotes";
import { fetchRandomQuote } from "../../../services/quotes/quotesService";
import {
  StorageFavouritesProvider,
  useFavourites,
} from "../../../hooks/useFavourites";

function givenUseRandomQuote(
  mock: Partial<UseQueryResult<QuoteResponse, Error>>
) {
  jest
    .mocked(useRandomQuote)
    .mockReturnValueOnce(mock as UseQueryResult<QuoteResponse, Error>);
}

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
  <StorageFavouritesProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  </StorageFavouritesProvider>
);

const renderHome = () => render(<HomeScreen />, { wrapper });

describe("index screen - home tab", () => {
  const mockQuote: QuoteResponse = {
    id: 1,
    quote: "Test quote",
    author: "Test Author",
  };
  const newMockQuote: QuoteResponse = {
    id: 2,
    quote: "Another test quote",
    author: "Another Author",
  };

  test("renders correctly", async () => {
    const { getByTestId } = renderHome();
    const homeScreen = getByTestId("home-screen-view");
    expect(homeScreen).toBeTruthy();
  });

  test("renders loading state", async () => {
    const mockResult: Partial<UseQueryResult<QuoteResponse, Error>> = {
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
    };
    givenUseRandomQuote(mockResult);

    const { getByTestId, queryByText } = renderHome();

    const initialLoad = getByTestId("home-screen-initial-load");
    expect(initialLoad).toBeTruthy();
    expect(queryByText("New quote")).toBeNull();
    expect(queryByText("Add to favourite")).toBeNull();
  });

  test("renders error state", async () => {
    const mockError = new Error("Network error");

    const mockResult: Partial<UseQueryResult<QuoteResponse, Error>> = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: mockError,
    };
    givenUseRandomQuote(mockResult);

    const { getByTestId, getByText, queryByText } = renderHome();

    const errorView = getByTestId("home-screen-error");
    const errorText = getByText(`Error: ${mockError.message}`);
    const retryButton = getByText("Retry");

    expect(errorView).toBeTruthy();
    expect(errorText).toBeTruthy();
    expect(retryButton).toBeTruthy();
    expect(queryByText("New quote")).toBeNull();
    expect(queryByText("Add to favourite")).toBeNull();
  });

  test("click on retry button", () => {
    const mockError = new Error("Network error");
    const mockRefetch: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<QuoteResponse, Error>> = jest.fn(
      () => new Promise(() => {})
    );

    const mockResult: Partial<UseQueryResult<QuoteResponse, Error>> = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: mockError,
      refetch: mockRefetch,
    };
    givenUseRandomQuote(mockResult);

    const { getByText } = renderHome();

    const retryButton = getByText("Retry");

    fireEvent.press(retryButton);
    expect(mockRefetch).toHaveBeenCalled();
  });

  test("renders quote view", async () => {
    const mockQuote: QuoteResponse = {
      id: 1,
      quote: "Test quote",
      author: "Test Author",
    };
    const mockResult: Partial<UseQueryResult<QuoteResponse, Error>> = {
      data: mockQuote,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    };
    givenUseRandomQuote(mockResult);

    const { getByText } = renderHome();

    const quoteText = getByText(mockQuote.quote);
    const authorText = getByText(`- ${mockQuote.author}`);
    const newQuoteButton = getByText("New quote");
    const favoriteButton = getByText("Add to favourite");

    expect(quoteText).toBeTruthy();
    expect(authorText).toBeTruthy();
    expect(newQuoteButton).toBeTruthy();
    expect(favoriteButton).toBeTruthy();
  });

  test('refetches quote when "New quote" button is pressed', async () => {
    const mockRefetch: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<QuoteResponse, Error>> = jest.fn(
      () => new Promise(() => {})
    );

    givenUseRandomQuote({
      data: mockQuote,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });
    givenUseRandomQuote({
      data: newMockQuote,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    const { getByText, rerender } = render(<HomeScreen />, { wrapper });

    const quoteText = getByText(mockQuote.quote);
    const authorText = getByText(`- ${mockQuote.author}`);
    expect(quoteText).toBeTruthy();
    expect(authorText).toBeTruthy();

    const newQuoteButton = getByText("New quote");

    fireEvent.press(newQuoteButton);
    expect(mockRefetch).toHaveBeenCalled();

    await waitFor(() => {
      rerender(<HomeScreen />);
    });
    expect(getByText(newMockQuote.quote)).toBeTruthy();
    expect(getByText(`- ${newMockQuote.author}`)).toBeTruthy();
  });
});
