import express, { json } from "express";
import mongoose from "mongoose";
import ValveRoutes from "./routes/valveRoutes_User";
// import CommandRouter from "./routes/controlCommandRouter";
import "dotenv/config";

const PORT = 3000;
const app = express();

//mongoDB init
const db = async () => {
  console.log("Connecting to db...");
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to db.");
    } else {
      console.log("MONGODB_URI not found.");
    }
  } catch (e) {
    console.log("Error connecting to MongoDB cluster: " + e);
  }
};

//routes init
app.use(json());
app.use("/valve", ValveRoutes);
// app.use("/commands", CommandRouter);

app.listen(PORT, async () => {
  await db();
  console.log(`Valve API running on https://localhost:${PORT}`);
});
