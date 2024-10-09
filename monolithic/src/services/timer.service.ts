import { TimerModel } from "../models/timer.model";

export async function saveTimerToDB(
  userId: string,
  time: number,
): Promise<string> {
  const newTimer = new TimerModel({
    userId,
    time,
  });
  const savedTimer = await newTimer.save();
  if (savedTimer) {
    return savedTimer.id;
  } else {
    throw new Error("Failed to create timer");
  }
}
