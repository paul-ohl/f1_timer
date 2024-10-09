import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyJwtToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!authHeader || !token) {
    res.status(401).send("Missing Authorization token");
    return;
  }

  let decodedJwt: JwtPayload;
  try {
    decodedJwt = verifyJwtToken(token);
  } catch (e: any) {
    res.status(401).send(e.message);
    return;
  }

  res.locals.jwt = decodedJwt;
  next();
}
