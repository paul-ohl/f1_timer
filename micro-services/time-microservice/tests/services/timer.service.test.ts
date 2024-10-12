import { connect_to_database } from '../../src/config/db';
import mongoose from 'mongoose';
import {
  createTime,
  getTimesByUserID as getTimesByUserId,
} from '../../src/services/time.service';
import { TimeModel } from '../../src/models/time.model';
import TimeRecord from '../../src/types/timeRecord';

describe('Time routes', () => {
  let userId: string;

  beforeAll(async () => {
    const db_uri = `mongodb://localhost:27017/test-${generateRandomString()}`;
    process.env.MONGO_URI = db_uri;
    userId = generateRandomString();
    await connect_to_database();
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await TimeModel.deleteMany({});
  });

  it('createTime succeeds with correct information', async () => {
    const timeRecord = new TimeRecord(userId, new Date(), 1.005);
    const timeId = await createTime(timeRecord);

    const timeDB = await TimeModel.findOne({ id: timeId });
    expect(timeDB?.time).toBe(1.005);
  });

  it('getTimeByUserId succeeds with correct information', async () => {
    const timeRecord1 = new TimeRecord(userId, new Date(), 1.005);
    const timeRecord2 = new TimeRecord(userId, new Date(), 1.009);
    const timeId1 = await createTime(timeRecord1);
    await createTime(timeRecord2);

    const times = await getTimesByUserId(userId);

    expect(times.length).toBe(2);
    const time1 = times.find(t => t.id == timeId1);
    expect(time1).not.toBe(undefined);
    expect(time1?.userId).toBe(userId);
    expect(time1?.time).toBe(1.005);
  });
});

function generateRandomString(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
