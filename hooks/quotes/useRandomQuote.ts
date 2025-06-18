import { useQuery } from "@tanstack/react-query";
import { fetchRandomQuote } from "../../services/quotes/quotesService";
import type { QuoteResponse } from "../../types/Quotes";

export function useRandomQuote() {
  return useQuery<QuoteResponse, Error>(
         {
              queryKey: ["randomQuote"],
              queryFn: async () => {
                const quote = await fetchRandomQuote();
                return quote;
              }
         },
  );
}