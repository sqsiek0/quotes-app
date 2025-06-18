import { cleanup, renderHook, waitFor } from "@testing-library/react-native";
import { useRandomQuote } from "../../../hooks/quotes/useRandomQuote";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { QuoteResponse } from "../../../types/Quotes";
import { fetchRandomQuote } from "../../../services/quotes/quotesService";

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
});

afterEach(async () => {
  if (queryClient) {
    queryClient.clear();
    await queryClient.cancelQueries();
    queryClient.unmount();
  }

  cleanup();
});

jest.mock("../../../services/quotes/quotesService", () => ({
  fetchRandomQuote: jest.fn(() => new Promise(() => {})),
}));

describe("useRandomQuote", () => {
  test("initial state", () => {
    const { result } = renderHook(() => useRandomQuote(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("fetches a random quote", async () => {
    const mockQuote: QuoteResponse = {
      id: 1,
      quote: "Test quote",
      author: "Test Author",
    };

    jest.mocked(fetchRandomQuote).mockResolvedValueOnce(mockQuote);

    const { result } = renderHook(() => useRandomQuote(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toEqual(mockQuote);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
