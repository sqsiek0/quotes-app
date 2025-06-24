import {
  InfiniteData,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "../../../hooks/ThemeProvider";
import Quotes from "../../../app/(tabs)/Quotes";
import { act, fireEvent, render } from "@testing-library/react-native";
import { useListQuotes } from "../../../hooks/quotes/useListQuotes";
import { QuoteListResponse } from "../../../types/Quotes";

import { useLocalSearchParams } from "expo-router";
jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  useLocalSearchParams: jest.fn(),
}));

jest.mock("../../../hooks/quotes/useListQuotes", () => ({
  useListQuotes: jest.fn(() => new Promise(() => {})),
}));
jest.mock("../../../services/quotes/quotesService", () => ({
  fetchListQuotes: jest.fn(() => new Promise(() => {})),
}));

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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
);

beforeEach(() => {
  queryClient = createTestQueryClient();
  jest.clearAllMocks();
  (useLocalSearchParams as jest.Mock).mockReturnValue({ search: "" });
});

describe("Quotes screen", () => {
  test("renders without crashing", () => {
    const { getByTestId } = render(<Quotes />, { wrapper });
    expect(getByTestId("quotes-screen")).toBeTruthy();
  });

  test("renders loading state", () => {
    const mockReturnValue: Partial<ReturnType<typeof useListQuotes>> = {
      data: undefined,
      isLoading: true,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    };

    jest
      .mocked(useListQuotes)
      .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);

    const { getByTestId } = render(<Quotes />, { wrapper });

    expect(getByTestId("quotes-loading-view")).toBeTruthy();
  });

  describe("when there is an error", () => {
    const mockError = new Error("Failed to fetch quotes");
    const mockedRefetch = jest.fn();
    const mockReturnValue: Partial<ReturnType<typeof useListQuotes>> = {
      data: undefined,
      isLoading: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: true,
      error: mockError,
      refetch: mockedRefetch,
    };

    test("renders error state", () => {
      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);
      const { getByTestId, getByText } = render(<Quotes />, { wrapper });

      expect(getByTestId("quotes-failed-view")).toBeTruthy();
      expect(
        getByText(`
Error: ${mockError.message}
            `)
      ).toBeTruthy();
      expect(getByText("Try again")).toBeTruthy();
    });

    test("calls refetch when 'Try again' button is pressed", () => {
      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);
      const { getByText } = render(<Quotes />, { wrapper });

      const retryButton = getByText("Try again");
      fireEvent.press(retryButton);
      expect(mockedRefetch).toHaveBeenCalled();
    });
  });

  describe("when quotes are loaded", () => {
    const mockQuotes: QuoteListResponse = {
      quotes: [
        { id: 1, quote: "Test Quote 1", author: "Author 1" },
        { id: 2, quote: "Test Quote 2", author: "Author 2" },
      ],
      total: 100,
      skip: 0,
      limit: 30,
    };
    const mockedRefetch = jest.fn();
    const mockedFetchNextPage = jest.fn();
    const mockReturnValue: Partial<ReturnType<typeof useListQuotes>> = {
      data: {
        pages: [mockQuotes],
        pageParams: [0],
      } as InfiniteData<QuoteListResponse>,
      isLoading: false,
      isRefetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      isError: false,
      error: null,
      fetchNextPage: mockedFetchNextPage,
      refetch: mockedRefetch,
    };

    test("renders list of quotes in FlatList", () => {
      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);

      const { getByText, queryByText, getByTestId } = render(<Quotes />, {
        wrapper,
      });

      // Should render each quote and author
      const quotesList = getByTestId("quotes-list");
      expect(quotesList).toBeTruthy();
      expect(getByText("Test Quote 1")).toBeTruthy();
      expect(getByText("- Author 1")).toBeTruthy();
      expect(getByText("Test Quote 2")).toBeTruthy();
      expect(getByText("- Author 2")).toBeTruthy();

      // Should not show loading or error views
      expect(queryByText("Try again")).toBeNull();
      expect(queryByText("quotes-loading-view")).toBeNull();
    });

    describe("when a search term is provided", () => {
      beforeEach(() => {
        // simulate URL search parameter
        (useLocalSearchParams as jest.Mock).mockReturnValue({
          search: "Test Quote 1",
        });
      });

      test("filters the list to matching quotes", () => {
        jest
          .mocked(useListQuotes)
          .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);

        const { queryByText } = render(<Quotes />, { wrapper });

        // only the first quote should be present
        expect(queryByText("Test Quote 1")).toBeTruthy();
        expect(queryByText("Test Quote 2")).toBeNull();
      });
    });

    test("calls refetch when pull-to-refresh is triggered", async () => {
      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);

      const { getByTestId } = render(<Quotes />, { wrapper });

      const flatList = getByTestId("quotes-list");
      expect(flatList).toBeTruthy();
      const { refreshControl } = flatList.props;
      await act(async () => {
        refreshControl.props.onRefresh();
      });
      expect(mockedRefetch).toHaveBeenCalled();
    });

    test("calls fetchNextPage when end of list is reached", async () => {
      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturnValue as ReturnType<typeof useListQuotes>);

      const { getByTestId } = render(<Quotes />, { wrapper });

      const flatList = getByTestId("quotes-list");
      expect(flatList).toBeTruthy();

      await act(async () => {
        flatList.props.onEndReached();
      });

      expect(mockedFetchNextPage).toHaveBeenCalled();
    });

    test("renders footer while next page is loading", () => {
      const mockReturn: Partial<ReturnType<typeof useListQuotes>> = {
        data: {
          pages: [mockQuotes],
          pageParams: [0],
        } as InfiniteData<QuoteListResponse>,
        isLoading: false,
        isRefetching: false,
        isFetchingNextPage: true,
        hasNextPage: true,
        isError: false,
        error: null,
      };

      jest
        .mocked(useListQuotes)
        .mockReturnValue(mockReturn as ReturnType<typeof useListQuotes>);

      const { getByTestId } = render(<Quotes />, { wrapper });

      expect(getByTestId("quotes-list-footer")).toBeTruthy();
    });
  });
});
