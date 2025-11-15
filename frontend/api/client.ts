
import { API_AUTH_URL } from "@/constants/env";
import axios from "axios";

export const api = axios.create({
  baseURL: API_AUTH_URL, // replace
  timeout: 8000,
});

