import { TimerModel } from "../models/timer.model";
import Timer from "../types/timer";

export async function createTimer(
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

export async function getTimersByUserID(userId: string): Promise<Timer[]> {
  const timers = await TimerModel.find({ userId: userId });
  return timers.map((t) => {
    return { id: t.id, time: t.time, userId: t.userId } as Timer;
  });
}
