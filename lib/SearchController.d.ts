export interface RequestOptions {
  from?: number;
  size?: number;
  kind?: Array<string>;
  search_text?: string;
  order_by?: string;
  //filters
  asset_categories?: Array<string>;
  fund_category?: Array<string>;
  investment_suitability?: Array<string>;
  management_approach?: Array<string>;
  dividend_frequency?: Array<string>;
  fund_size?: { min: string | null; max: string | null };
  management_fee?: { min: string | null; max: string | null };
  one_year_return?: { min: string | null; max: string | null };
  five_year_return?: { min: string | null; max: string | null };
}

export interface RequestData {
  count: number;
  indexed_at: number;
  results: SearchResult;
}

export interface SearchResult {
  is_flagship_fund: boolean;
  flagship_description_short: string;
  flagship_description_long: string;
  flagship_image_url: string;
  is_betashares: boolean;
  issuer: string;
  fund_size: string;
  management_fee: string;
  classification: string;
  sub_classification: string;
  inception_date: string;
  dividend_frequency: string;
  investment_suitability: string;
  quick_ratio: any;
  current_ratio: any;
  price_to_book_ratio: any;
  market_capitalisation: any;
  sector: any;
  trailing_12m_dividend_yield: string;
  forward_12m_dividend_yield: string;
  management_approach: string;
  total_assets: any;
  total_revenue: any;
  pe_ratio_ttm: any;
  franking_credits: any;
  logo: string;
  symbol_openfigi: string;
  symbol: string;
  display_name: string;
  kind: string;
  asset_classes: Array<string>;
  categories: Array<string>;
  asset_categories: Array<string>;
  asset_category_ids: Array<string>;
  tags: any[];
  is_portfolio_excluded: boolean;
  is_auto_invest_included: boolean;
  currency: string;
  domicile: string;
  exchange: string;
  one_year_return: string;
  five_year_return: string;
}
