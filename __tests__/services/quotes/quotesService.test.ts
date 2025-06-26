import { apiClient } from "../../../services/apiClient";
import AxiosMockAdapter from "axios-mock-adapter";
import { QuoteListResponse, QuoteResponse } from "../../../types/Quotes";
import { QUOTES_RANDOM } from "../../../constants/api/Api";
import {
  fetchListQuotes,
  fetchRandomQuote,
  fetchSingleQuote,
} from "../../../services/quotes/quotesService";

describe("quotesService", () => {
  afterEach(() => {
    mockedClient.reset();
  });

  const mockResponse: QuoteResponse = {
    id: 1,
    quote: "This is a random quote.",
    author: "Author Name",
  };
  const mockListResponse: QuoteListResponse = {
    quotes: [mockResponse],
    total: 1,
    skip: 0,
    limit: 30,
  };

  const mockedClient = new AxiosMockAdapter(apiClient);

  test("fetchRandomQuote should return a random quote", async () => {
    mockedClient.onGet(QUOTES_RANDOM).reply(200, mockResponse);

    const response = await fetchRandomQuote();
    expect(response).toEqual(mockResponse);
  });

  test("fetchSingleQuote should return a single quote by ID", async () => {
    const quoteId: number = 1;
    mockedClient.onGet(`/${quoteId}`).reply(200, mockResponse);

    const response = await fetchSingleQuote(quoteId);
    expect(response).toEqual(mockResponse);
  });

  test("fetchListQuotes should return a list of quotes", async () => {
    mockedClient.onGet().reply(200, mockListResponse);

    const response = await fetchListQuotes();
    expect(response).toEqual(mockListResponse);
  });
});
