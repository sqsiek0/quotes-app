jest.mock("../../../services/quotes/quotesService", () => ({
  fetchListQuotes: jest.fn(() => new Promise(() => {})),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchListQuotes } from "../../../services/quotes/quotesService";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useListQuotes, getNextPageParam } from "../../../hooks/quotes/useListQuotes";
import { QuoteListResponse, QuoteResponse } from "../../../types/Quotes";

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
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient = createTestQueryClient();
  jest.clearAllMocks();
});

afterEach(async () => {
  if (queryClient) {
    queryClient.clear();
    await queryClient.cancelQueries();
    queryClient.unmount();
    queryClient = createTestQueryClient();
  }
});

describe('useListQuotes', () => {
    const mockedQuotes: QuoteListResponse ={
        quotes: [
            {
                id: 1,
                quote: "Test quote",    
                author: "Test Author"
            } as QuoteResponse,
            {
                id: 2,
                quote: "Test quote2",    
                author: "Test Author2"
            } as QuoteResponse
        ],
        total: 100,
        skip: 0,
        limit: 30
    }

    test('initial state', () => {
        const { result } = renderHook(() => useListQuotes(), { wrapper });

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isRefetching).toBe(false);
        expect(result.current.isFetchingNextPage).toBe(false);
        expect(result.current.hasNextPage).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
    })

    test('fetches quotes', async () => {
        jest.mocked(fetchListQuotes).mockResolvedValueOnce(mockedQuotes);

        const { result } = renderHook(() => useListQuotes(), { wrapper });

        await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isRefetching).toBe(false);
        expect(result.current.data?.pages[0]).toEqual(mockedQuotes);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBeNull();
        })
    })

    test('handles error when fetching quotes', async () => {
        const mockError = new Error("Failed to fetch quotes");
        jest.mocked(fetchListQuotes).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useListQuotes(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.isRefetching).toBe(false);
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toEqual(mockError);
            expect(result.current.data).toBeUndefined();
            
        })
    })

    test('refetches quotes when refetch is called', async () => {
        jest.mocked(fetchListQuotes).mockResolvedValueOnce(mockedQuotes).mockResolvedValueOnce(mockedQuotes);

        const { result } = renderHook(() => useListQuotes(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data?.pages[0]).toEqual(mockedQuotes);
        });

        result.current.refetch();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data?.pages[0]).toEqual(mockedQuotes);
        })

    })

    test('fetches next page of quotes', async () => {
        const nextPageQuotes: QuoteListResponse = {
            quotes: [
                {
                    id: 3,
                    quote: "Test quote3",
                    author: "Test Author3"
                } as QuoteResponse,
                {
                    id: 4,
                    quote: "Test quote4",
                    author: "Test Author4"
                } as QuoteResponse
            ],
            total: 100,
            skip: 30,
            limit: 30
        };

        jest.mocked(fetchListQuotes)
            .mockResolvedValueOnce(mockedQuotes)
            .mockResolvedValueOnce(nextPageQuotes);

        const { result } = renderHook(() => useListQuotes(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data?.pages[0]).toEqual(mockedQuotes);
            expect(result.current.hasNextPage).toBe(true);
            expect(result.current.isFetchingNextPage).toBe(false);

        });

        result.current.fetchNextPage();

        await waitFor(() => {
            expect(result.current.isFetchingNextPage).toBe(false);
            expect(result.current.data?.pages[1]).toEqual(nextPageQuotes);
            expect(result.current.hasNextPage).toBe(true);
        });
    })
    
    test("does not fetch next page when hasNextPage is false", async () => {
      const smallQuotes: QuoteListResponse = {
        quotes: mockedQuotes.quotes,
        total: mockedQuotes.quotes.length,
        skip: 0,
        limit: 30,
      };
      jest.mocked(fetchListQuotes).mockResolvedValueOnce(smallQuotes);

      const { result } = renderHook(() => useListQuotes(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNextPage).toBe(false);

      act(() => {
        result.current.fetchNextPage();
      });

      expect(fetchListQuotes).toHaveBeenCalledTimes(1);
    });

    
})

describe("getNextPageParam helper", () => {
  test("returns next skip when skip + limit is less than total", () => {
    const page: QuoteListResponse = { quotes: [], total: 100, skip: 0, limit: 30 };
    expect(getNextPageParam(page)).toBe(30);
  });

  test("returns undefined when skip + limit equals total", () => {
    const page: QuoteListResponse = { quotes: [], total: 100, skip: 70, limit: 30 };
    expect(getNextPageParam(page)).toBeUndefined();
  });

  test("returns undefined when skip + limit exceeds total", () => {
    const page: QuoteListResponse = { quotes: [], total: 50, skip: 40, limit: 20 };
    expect(getNextPageParam(page)).toBeUndefined();
  });
});