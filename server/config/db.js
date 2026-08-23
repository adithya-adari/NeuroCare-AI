import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Trying to connect to MongoDB...");
  console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    console.log(
      "MongoDB database name:",
      mongoose.connection.name
    );

    console.log(
      "MongoDB host:",
      mongoose.connection.host
    );

  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;