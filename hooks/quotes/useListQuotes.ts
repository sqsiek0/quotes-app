import { useQuery } from "@tanstack/react-query";

export function useListQuotes(page: number, limit: number) {
  return useQuery({
    queryKey: ["listQuotes", page, limit],
    queryFn: async () => {
    //   const { data } = await apiClient.get<QuoteListResponse>("/quotes", {
    //     params: { limit, skip: (page - 1) * limit },
    //   });
    //   return data;
    },
    // keepPreviousData: true,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
}