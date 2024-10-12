import { Request, Response } from 'express';
import { createTime, getTimesByUserID } from '../services/time.service';
import TimeRecord from '../types/timeRecord';

export async function saveTime(req: Request, res: Response) {
  const { time } = req.body;

  if (!time) {
    res.status(400).send('Please provide a time value');
  }
  if (!res.locals.jwt || !res.locals.jwt.uid) {
    res.status(500).send('Missing data from jwt');
  }
  const userId = res.locals.jwt.uid;

  const timeRecord = new TimeRecord(userId, new Date(), time);

  try {
    await createTime(timeRecord);
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
  res.status(201).send('Time created');
}

export async function getTimeByUser(req: Request, res: Response) {
  if (!res.locals.jwt || !res.locals.jwt.uid) {
    res.status(500).send('Missing data from jwt');
  }

  let userId = req.body.userId;
  if (!userId) {
    userId = res.locals.jwt.uid;
  } else if (userId !== res.locals.jwt.uid && res.locals.jwt.role !== true) {
    // If the user didn't request their own uid,
    // they have to be an admin to retrieve someone else's times
    res.status(401).send('You are not authorized to retrieve those times');
  }

  try {
    const times: TimeRecord[] = await getTimesByUserID(userId);
    res.status(200).send('[' + times.map(t => t.toJSON()).join(',') + ']');
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
