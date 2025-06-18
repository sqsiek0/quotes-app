import { useQuery } from "@tanstack/react-query";
import { fetchRandomQuote } from "../../services/quotes/quotesService";
import type { QuoteResponse } from "../../types/Quotes";
import { Timer } from "lucide-react-native";

export function useRandomQuote() {
  return useQuery<QuoteResponse, Error>(
         {
              queryKey: ["randomQuote"],
              queryFn: async () => {
                const quote = await fetchRandomQuote();
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return quote;
              }
         },
  );
}