import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Hackathon from "./models/Hackathon.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
try{
mongoose.connect("mongodb+srv://RdConclave26:RdConclave%402026%23@rdconclave.5mu2koe.mongodb.net/RDConclave?retryWrites=true&w=majority");
console.log("connected");
}catch(err){
    console.log(err);
}
app.get("/reset", async (req, res) => {
  await Hackathon.findOneAndUpdate(
    {},
    {
      status: "WAITING",
      startTime: null
    },
    { upsert: true }
  );

  // Notify all connected clients
  io.emit("RESET_EVENT");

  console.log("Hackathon reset to WAITING state");

  res.json({
    success: true,
    message: "Hackathon reset successfully"
  });
});

io.on("connection", async (socket) => {
  console.log("Client connected");

  const hackathon = await Hackathon.findOne();

  // Sync state on connect
  if (hackathon?.status === "RUNNING") {
    socket.emit("SYNC_RUNNING", {
      startTime: hackathon.startTime
    });
  }

  socket.on("START_REQUEST", async () => {
    let doc = await Hackathon.findOne();

    if (doc?.status === "RUNNING") return;

    doc = await Hackathon.findOneAndUpdate(
      {},
      {
        status: "RUNNING",
        startTime: new Date()
      },
      { upsert: true, new: true }
    );

    io.emit("START_EVENT", {
      startTime: doc.startTime
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
