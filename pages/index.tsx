import { useEffect } from "react";
import { makeRequest } from "@/lib/SearchController";

export default function Page() {
  useEffect(() => {
    async function callback() {
      try {
        const res = await makeRequest({
          search_text: "gold",
          from: 0,
          size: 10,
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }

    callback();
  }, []);

  return <>Hello world</>;
}
