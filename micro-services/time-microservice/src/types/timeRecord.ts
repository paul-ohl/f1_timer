import Time from './time';

class TimeRecord {
  private _id?: string;
  private _userId: string;
  private _date: Date;
  private _time: Time;

  constructor(userId: string, date: Date, time: number, id?: string) {
    if (!userId || !date || !time) {
      throw new Error('TimeRecord must have userId, date, and time');
    } else if (time < 0) {
      throw new Error('Time must be positive');
    }
    this._userId = userId;
    this._date = date;
    this._time = new Time(time);
    if (id) {
      this._id = id;
    }
  }

  toModel() {
    if (this._id) {
      return {
        id: this._id,
        userId: this._userId,
        date: this._date,
        time: this._time,
      };
    } else {
      return {
        userId: this._userId,
        date: this._date,
        time: this._time,
      };
    }
  }

  toJSON() {
    return JSON.stringify(this.toModel());
  }

  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get date() {
    return this._date;
  }
  get time() {
    return this._time.value;
  }
}

export default TimeRecord;
