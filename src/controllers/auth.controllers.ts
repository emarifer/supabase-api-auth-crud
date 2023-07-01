import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { UserCreateType } from "../types/collections";
import db from "../db/supabase-client";
import {
  createAccessToken,
  payloadToken,
  verifyAccessToken,
} from "../libs/jwt";

import { TokenData } from "../..";

type loginBody = {
  email: string;
  password: string;
};

type authResponse = {
  id: string;
  username: string;
  email: string;
};

export const register = async (
  req: Request<unknown, unknown, UserCreateType>,
  res: Response
) => {
  const { email, password, username } = req.body;

  try {
    // check if the email is in the database
    const { data: userFound, error: errorCheck } = await db
      .from("users")
      .select("*")
      .limit(1)
      .eq("email", email);

    if (errorCheck) throw new Error(errorCheck.message);

    // you have to add «return» in the validations, otherwise an error
    // will be produced: "Can't set headers after they are sent to the client"
    if (userFound?.length) {
      return res.status(400).json({ message: "The email is already in use" });
    }

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // instantiating the UserType collection
    const newUser: UserCreateType = {
      email,
      password: passwordHash,
      username,
    };

    // saving the user in the database
    const { data: userSaved, error: errorUser } = await db
      .from("users")
      .insert(newUser)
      .select();

    if (errorUser) throw new Error(errorUser.message);

    if (userSaved[0]) {
      const userCreated: authResponse = {
        id: userSaved[0].id,
        username: userSaved[0].username,
        email: userSaved[0].email,
      };

      // create access token
      const payload: payloadToken = {
        id: userCreated.id,
      };
      const token = await createAccessToken(payload);

      // save token in cookie
      res.cookie("token", token);

      // responding a json from the backend with user created
      res.json(userCreated);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Error creating user: ${err.message}` });
    }
  }
};

export const login = async (
  req: Request<unknown, unknown, loginBody>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    // check if the email is in the database
    const { data: userFound, error: errorCheck } = await db
      .from("users")
      .select("*")
      .limit(1)
      .eq("email", email);

    if (errorCheck) throw new Error(errorCheck.message);

    // you have to add «return» in the validations, otherwise an error
    // will be produced: "Can't set headers after they are sent to the client"
    if (!userFound.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // is passwords match?
    const isPasswordsMatch = await bcrypt.compare(
      password,
      userFound[0]!.password
    );

    if (!isPasswordsMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userLogged: authResponse = {
      id: userFound[0]!.id, // we are sure that the user exists because we have already checked it
      username: userFound[0]!.username,
      email: userFound[0]!.email,
    };

    // create access token
    const payload: payloadToken = {
      id: userLogged.id,
    };
    const token = await createAccessToken(payload);

    // save token in cookie
    res.cookie("token", token);

    // responding a json from the backend with user logged
    res.json(userLogged);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `User login error: ${err.message}` });
    }
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const token: string = req.cookies["token"];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // If the token exists, check that it is valid
    const userId = ((await verifyAccessToken(token)) as TokenData).id;

    // check if the user is still in the database
    const { data: userFound, error: errorCheck } = await db
      .from("users")
      .select("*")
      .limit(1)
      .eq("id", userId);

    if (errorCheck) throw new Error(errorCheck.message);

    if (!userFound.length) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userLogged: authResponse = {
      id: userFound[0]!.id, // we are sure that the user exists because we have already checked it
      username: userFound[0]!.username,
      email: userFound[0]!.email,
    };

    // responding a json from the backend with user logged
    res.json(userLogged);
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({
        message: `Unauthorized. Error getting token or user from database: ${err.message}`,
      });
    }
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.sendStatus(204);
  // https://stackoverflow.com/questions/36220029/http-status-to-return-after-trying-to-logout-without-being-logged-in
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
};

export const profile = async (req: Request, res: Response) => {
  console.log(req.tokenData);
  res.send("profile\n");
};

/*
 * ERROR: Cannot set headers after they are sent to client. VER:
 * https://www.datainfinities.com/43/cant-set-headers-after-they-are-sent-to-the-client
 * https://dev.to/collegewap/fix-cannot-set-headers-after-they-are-sent-to-the-client-19gk
 */

/*
 * ENVIAR COOKIES CON cURL. VER:
 * https://reqbin.com/req/c-bjcj04uw/curl-send-cookies-example#:~:text=Cookies%20are%20passed%20to%20Curl,web%20forms%2C%20and%20file%20uploads.
 *
 * COMANDOS PARA cURL:
 * curl -v -X POST http://localhost:8000/api/register -d '{"email": "enrique@enrique.com", "password": "1234", "username": "emarifer"}' -H "content-type: application/json" | json_pp

curl -v -X POST http://localhost:8000/api/login -d '{"email": "enrique@enrique.com", "password": "1234"}' -H "content-type: application/json" | json_pp


curl -v -X POST http://localhost:8000/api/register -d '{"email": "julieta@julieta.com", "password": "123456", "username": "julietahe"}' -H "content-type: application/json" | json_pp

$2a$10$qDhcVIzLAzuYLIYXcgTf2eFbKoFXVyZjK.hkKeLdlVUqxx4RcQnU.
$2a$10$s5MO6F480M3DJ.CtdOPWGez67hJYl6BcpR/tz4eM/03Srd3A.iCYO // con 10 pasadas bcrypt genera passwords de 60 caracteres


curl -v -X POST http://localhost:8000/api/register -d '{"email": "senderista@senderista.com", "password": "alcazaba1964*", "username": "hicker"}' -H "content-type: application/json" | json_pp
 */
