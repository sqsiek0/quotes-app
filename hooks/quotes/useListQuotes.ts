import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchListQuotes } from "../../services/quotes/quotesService";
import type { QuoteListResponse } from "../../types/Quotes";

export function getNextPageParam(
  lastPage: QuoteListResponse,
): number | undefined {
  const nextSkip = lastPage.skip + lastPage.limit;
  return nextSkip < lastPage.total ? nextSkip : undefined;
}

export function useListQuotes(limit: number = 30) {
  const query = useInfiniteQuery({
    queryKey: ["quotes", limit],
    queryFn: ({ pageParam = 0 }) => fetchListQuotes(limit, pageParam),
    getNextPageParam,
    initialPageParam: 0,
  });
  return query;
}
