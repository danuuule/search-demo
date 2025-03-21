import { useEffect } from "react";
import { makeRequest } from "@/lib/SearchController";

export default function Page() {
  useEffect(() => {
    async function callback() {
      try {
        const response = await makeRequest({
          // search_text: "gold",
          from: 1,
          size: 10,
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    callback();
  }, []);

  return <>Hello world</>;
}
