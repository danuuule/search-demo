// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSearchTerms } from "@/lib/DatabaseController";

type Data = {
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const searchTerms = await getSearchTerms();
    res.status(200).json({ status: 200, searchTerms });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 500 });
  }
}
