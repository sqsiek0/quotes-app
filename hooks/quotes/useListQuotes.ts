import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchListQuotes } from "../../services/quotes/quotesService";

export function useListQuotes(limit: number = 30) {
    const query = useInfiniteQuery({
      queryKey: ["quotes", limit],
      queryFn: ({ pageParam = 0 }) => fetchListQuotes(limit, pageParam),
      getNextPageParam: (lastPage) => {
        const nextSkip = lastPage.skip + lastPage.limit;
        return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0, 
      
    });
    return query;
}