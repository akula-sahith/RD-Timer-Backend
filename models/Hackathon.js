import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["WAITING", "RUNNING", "ENDED"],
    default: "WAITING"
  },
  startTime: Date,
  duration: {
    type: Number,
    default: 24 * 60 * 60 * 1000
  }
});

export default mongoose.model("Hackathon", hackathonSchema);
