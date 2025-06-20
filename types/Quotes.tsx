interface Quote {
  id: number;
  quote: string;
  author: string;
}

export interface QuoteResponse extends Quote {}

export interface QuoteListResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}
