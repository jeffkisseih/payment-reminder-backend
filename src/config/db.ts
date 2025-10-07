import mongoose from "mongoose";

export const connectDB = async () => {
  const connect = async () => {
    try {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined.");
      }
      await mongoose.connect(mongoUri, {
        serverApi: { version: "1", strict: true, deprecationErrors: true },
      });

      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ MongoDB connection failed:", err.message);
      } else {
        console.error("❌ MongoDB connection failed:", err);
      }
      console.log("⏳ Retrying in 5 seconds...");
      setTimeout(connect, 5000); // retry instead of crashing
    }
  };

  connect();

  // ✅ Handle connection drop and auto-reconnect
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected! Reconnecting...");
    connect();
  });

  mongoose.connection.on("error", (err) => {
    console.error("⚠️ MongoDB error:", err);
  });
};


