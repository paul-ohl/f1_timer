import mongoose, { Schema } from 'mongoose';

const TimerSchema = new Schema({
  id: Number,
  userId: String,
  time: Number,
});

export const TimerModel = mongoose.model('Timer', TimerSchema);
