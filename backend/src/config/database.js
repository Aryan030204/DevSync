const mongoose = require("mongoose");
require("dotenv").config();
const { isProduction } = require("./env");

const connect_db = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://admin:admin@cluster0.gjuq7.mongodb.net/devTinder";

    if (isProduction && !process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required in production");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB failed to connect, error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connect_db;
