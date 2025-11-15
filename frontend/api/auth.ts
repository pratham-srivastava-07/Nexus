import { api } from "./client";

// SIGNUP → expects { email, walletAddress }
export const signup = async (payload: {
  email: string;
  walletAddress: string;
}) => {
  const res = await api.post("/signup", payload);
  return res.data;
};

// LOGIN → expects { email }
export const signin = async (payload: {
  email: string;
}) => {
  const res = await api.post("/login", payload); // backend route is loginController
  return res.data;
};
