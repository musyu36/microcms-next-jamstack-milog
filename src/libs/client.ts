import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: "milog" || "",
  apiKey: process.env.API_KEY || "",
});
