import { Request, Response } from "express";
import { createTimer, getTimersByUserID } from "../services/timer.service";

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
    await createTimer(userId, time);
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
  res.status(201).send("Timer created");
}

export async function getTimerByUser(req: Request, res: Response) {
  if (!res.locals.jwt || !res.locals.jwt.uid) {
    res.status(500).send("Missing data from jwt");
  }

  let userId = req.body.userId;
  if (!userId) {
    userId = res.locals.jwt.uid;
  } else if (userId !== res.locals.jwt.uid && res.locals.jwt.role !== true) {
    // If the user didn't request their own uid, they have to be an admin to retrieve someone else's timers
    res.status(401).send("You are not authorized to retrieve those timers");
  }

  try {
    const timers = await getTimersByUserID(userId);
    res.status(200).send(JSON.stringify(timers));
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
