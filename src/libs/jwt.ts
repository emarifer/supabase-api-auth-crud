import jwt from "jsonwebtoken";

import { TOKEN_SECRET } from "../config";

export type payloadToken = {
  id: string;
};

export const createAccessToken = (payload: payloadToken) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const verifyAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
