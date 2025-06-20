jest.mock("../../../services/quotes/quotesService", () => ({
  fetchRandomQuote: jest.fn(() => new Promise(() => {})),
}));

import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
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

describe("useRandomQuote", () => {
  test("initial state", () => {
    const { result } = renderHook(() => useRandomQuote(), { wrapper });

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

    const { result } = renderHook(() => useRandomQuote(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toEqual(mockQuote);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  test("handles error when fetching quote", async () => {
    const mockError = new Error("Failed to fetch quote");
    jest.mocked(fetchRandomQuote).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRandomQuote(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  test("refetches quote when refetch is called", async () => {
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

    jest.mocked(fetchRandomQuote).mockResolvedValueOnce(mockQuote);

    const { result } = renderHook(() => useRandomQuote(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuote);
    });

    jest.mocked(fetchRandomQuote).mockResolvedValueOnce(newMockQuote);
    result.current.refetch();
    await waitFor(() => {
      expect(result.current.data).toEqual(newMockQuote);
      expect(result.current.isFetching).toBe(false);
    });
  });

  test("calls fetchRandomQuote on mount", () => {
    renderHook(() => useRandomQuote(), { wrapper });
    expect(fetchRandomQuote).toHaveBeenCalledTimes(1);
  });
});
