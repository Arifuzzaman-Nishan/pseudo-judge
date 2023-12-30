import mongoose from "mongoose";

const mongoDBUri = process.env.MONGODB_URI;

const mongoConnection = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(mongoDBUri as string);
  } catch (err: any) {
    throw new Error("Error connecting to database");
  }
};

export default mongoConnection;
