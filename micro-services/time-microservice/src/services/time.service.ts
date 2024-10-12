import { TimeModel } from '../models/time.model';
import TimeRecord from '../types/timeRecord';

export async function createTime(time: TimeRecord): Promise<string> {
  const newTime = new TimeModel(time.toModel());
  const savedTime = await newTime.save();
  if (savedTime) {
    return savedTime.id;
  } else {
    throw new Error('Failed to create time');
  }
}

export async function getTimesByUserID(userId: string): Promise<TimeRecord[]> {
  const times = await TimeModel.find({ userId: userId });
  return times.map(
    (t: any) => new TimeRecord(t.userId, t.date, t.time, t.id),
  );
}
