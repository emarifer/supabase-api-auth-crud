import { Request, Response, NextFunction } from "express";

import { TokenData } from "../..";
import { verifyAccessToken } from "../libs/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies["token"];
  // console.log(token);
  // console.log("validating token…");
  // next();

  // check if token exists in cookie
  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    // If the token exists, check that it is valid
    const decodedToken = (await verifyAccessToken(token)) as TokenData;

    // console.log(decodedToken);

    req.tokenData = {
      id: decodedToken.id,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
    // console.log(req.tokenData);

    next();
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(401)
        .json({ error: `Error verifying authorization: ${err.message}` });
    }
  }
};

/*
 * TIPAR EL RESULTADO DE LA FUNCIÓN verifyAccessToken. VER:
 * https://stackoverflow.com/questions/68024844/how-can-get-the-property-from-result-of-jwt-verify-method-that-was-already-cre
 *
 * OBTENER LAS COOKIES DE Request. VER:
 * https://stackoverflow.com/questions/72906516/how-to-get-cookie-in-express-typescript
 *
 * AGREGAR UNA NUEVA PROPIEDAD A Request. VER:
 * https://plusreturn.com/blog/how-to-extend-express-request-interface-in-typescript/#Why_express-serve-static-core_not_express
 */
