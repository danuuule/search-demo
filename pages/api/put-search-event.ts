// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { addSearchTerm } from "@/lib/DatabaseController";

type Data = {
  [key: string]: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PUT") {
    const value = req.body?.value;
    const item = await addSearchTerm(value);
    res.status(200).json({ status: 200, ...item });
  } else {
    res.status(405).send({ status: 405 });
  }
}
