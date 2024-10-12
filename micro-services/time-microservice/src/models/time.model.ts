import mongoose, { Schema } from 'mongoose';

export const TimeSchema = new Schema({
  id: Number,
  userId: String,
  time: Number,
});

export const TimeModel = mongoose.model('Timer', TimeSchema);
