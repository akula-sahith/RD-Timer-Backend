import mongoose from "mongoose";

const HackathonSchema = new mongoose.Schema({
  branch: { type: String, unique: true }, // it / cse
  status: String,
  startTime: Date
});

export default mongoose.model("Hackathon", HackathonSchema);
