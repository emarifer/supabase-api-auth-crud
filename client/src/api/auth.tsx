import axios from "./axios-config";

import { UserRegisterRequest, UserLoginRequest } from "../types";

export const registerRequest = async (user: UserRegisterRequest) =>
  axios.post("/register", user);

export const loginRequest = async (user: UserLoginRequest) =>
  axios.post("/login", user);

export const verifyTokenRequest = async () => axios.get("/auth-verify");
