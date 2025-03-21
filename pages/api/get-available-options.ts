import type { NextApiRequest, NextApiResponse } from "next";
import { makeRequest } from "@/lib/SearchController";
import { RequestData } from "@/lib/SearchController.d";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const obj: any = {};
  let response = {} as RequestData;
  try {
    response = await makeRequest({
      from: 1,
      size: 1000,
    });

    const keysWithOptions = [
      "asset_categories",
      "investment_suitability",
      "management_approach",
      "dividend_frequency",
    ];
    keysWithOptions.map((key) => {
      let arr: any[] = [];
      response.results.forEach((item) => {
        if (item?.[key]) {
          const value = Array.isArray(item[key]) ? item[key] : [item[key]];
          arr = [...arr, ...value];
        }
      });
      obj[key] = [...new Set(arr)];
    });

    const keysWithValues = [
      "fund_size",
      "management_fee",
      "one_year_return",
      "five_year_return",
    ];
    keysWithValues.map((key) => {
      let min: number = 0;
      let max: number = 0;
      const values: any = [];
      response.results.forEach((item) => {
        const value = parseFloat(item[key]);
        if (!isNaN(value)) {
          values.push(value);
        }
      });
      min = Math.min(...values);
      max = Math.max(...values);
      obj[key] = { min, max };
    });
  } catch (err) {
    console.log(err);
  }

  // const r: any = { options: obj, response: response };
  res.status(200).json(obj);
}
