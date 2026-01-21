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

mongoose.connect("mongodb+srv://RdConclave26:RdConclave%402026%23@rdconclave.5mu2koe.mongodb.net/RDConclave");

io.on("connection", async (socket) => {
  console.log("Client connected");

  // join IT or CSE room
  socket.on("join-room", async (branch) => {
    socket.join(branch);
    console.log("Joined room:", branch);

    const hackathon = await Hackathon.findOne({ branch });

    if (hackathon?.status === "RUNNING") {
      socket.emit("SYNC_RUNNING", {
        startTime: hackathon.startTime
      });
    }
  });

  // start timer
  socket.on("START_REQUEST", async (branch) => {
    let doc = await Hackathon.findOne({ branch });

    if (doc?.status === "RUNNING") return;

    doc = await Hackathon.findOneAndUpdate(
      { branch },
      {
        branch,
        status: "RUNNING",
        startTime: new Date()
      },
      { upsert: true, new: true }
    );

    io.to(branch).emit("START_EVENT", {
      startTime: doc.startTime
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
