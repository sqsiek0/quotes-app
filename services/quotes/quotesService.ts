import { QUOTES_RANDOM } from "../../constants/api/Api";
import { QuoteListResponse, QuoteResponse } from "../../types/Quotes";
import { apiClient } from "../apiClient";

export async function fetchRandomQuote(): Promise<QuoteResponse> {
  const {data} = await apiClient.get<QuoteResponse>(QUOTES_RANDOM);

  return data;
}

export async function fetchSingleQuote(id: number): Promise<QuoteResponse> {
  const { data } = await apiClient.get<QuoteResponse>(`/${id}`);
  return data;
}


export async function fetchListQuotes(limit = 30, skip = 0): Promise<QuoteListResponse> {
  const { data } = await apiClient.get<QuoteListResponse>(QUOTES_RANDOM, {
    params: { limit, skip },
  });
  return data;
}