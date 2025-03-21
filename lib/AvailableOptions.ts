export const asset_categories = [
  "Australian Equities",
  "Cash",
  "Australian Bonds",
  "International Equities",
  "Technology",
  "Thematic",
  "Shorts Funds & Geared Funds",
  "International Bonds",
  "Financial",
  "Diversified",
  "Healthcare",
  "International Equities - Emerging Markets",
  "International - Countries & Regions",
  "Energy & Materials",
  "International Equities - Asia",
  "International Equities - US",
  "Gold & Commodities",
  "Property & Infrastructure",
  "Currency",
  "Consumer Goods",
  "Services",
  "Transportation",
  "Capital Goods",
] as const;

export const investment_suitability = [
  "Capital growth and regular income",
  "Regular income",
  "Capital growth",
  "Income distribution",
] as const;

export const management_approach = ["Passive", "Active"] as const;
export const dividend_frequency = [
  "Quarterly",
  "Monthly",
  "Semiannually",
  "Annually",
] as const;
export const fund_size = { min: 0.49247, max: 1807344.339257 };
export const management_fee = { min: 0.03, max: 2.54 };
export const one_year_return = { min: -98.996488, max: 1400 };
export const five_year_return = { min: -66.944885, max: 180.552869 };

export type AssetCategories = (typeof asset_categories)[number];
export type InvestmentSuitability = (typeof investment_suitability)[number];
export type ManagementApproach = (typeof management_approach)[number];
export type DividendFrequency = (typeof dividend_frequency)[number];
export interface MinMax {
  min: string | null;
  max: string | null;
}
