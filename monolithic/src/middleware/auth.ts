import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../utils/jwt";
import JwtPayload from "../types/jwtPayload";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!authHeader || !token) {
    res.status(401).send("Unauthorized");
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
