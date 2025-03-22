import axios, { AxiosResponse } from "axios";
import { RequestData, RequestOptions } from "./SearchController.d";

export async function makeRequest(opts: RequestOptions): Promise<RequestData> {
  const response: AxiosResponse<RequestData> = await axios.post(
    "https://search.betashares.services/search",
    opts
  );

  return response?.data;
}

export async function storeSearchTerm(value: string): Promise<object> {
  const response: AxiosResponse<RequestData> = await axios.put(
    "/api/put-search-event",
    { value }
  );

  return response?.data;
}
