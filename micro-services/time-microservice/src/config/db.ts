import mongoose from 'mongoose';

export async function connect_to_database() {
  const mongo_uri = process.env.MONGO_URI;
  if (!mongo_uri) {
    throw new Error('MONGO_URI is not defined');
  }
  await mongoose.connect(mongo_uri);
}
