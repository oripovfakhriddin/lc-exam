import { ENDPOINT } from "./const.js";

export const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
});

