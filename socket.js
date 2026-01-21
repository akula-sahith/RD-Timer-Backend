import { io } from "socket.io-client";

io.on("connection", (socket) => {
  socket.on("join-room", (branch) => {
    socket.join(branch);
    console.log(`Joined ${branch}`);
  });

  socket.on("start-timer", async ({ branch }) => {
    // create/update timer document for that branch
    io.to(branch).emit("timer-update", { branch });
  });
});

export default socket;
