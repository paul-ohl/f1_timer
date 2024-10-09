import { Request, Response } from "express";
import { saveTimerToDB } from "../services/timer.service";

export async function saveTimer(req: Request, res: Response) {
  const { time } = req.body;

  if (!time) {
    res.status(400).send("Please provide a time value");
  }
  if (!res.locals.jwt || !res.locals.jwt.uid) {
    res.status(500).send("Missing data from jwt");
  }
  const userId = res.locals.jwt.uid;

  try {
    await saveTimerToDB(userId, time);
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
  res.status(201).send("Timer created");
}
