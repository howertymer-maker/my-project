import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3003;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("[realtime] client connected:", socket.id);

  socket.on("post:created", (data) => {
    io.emit("post:new", data);
  });

  socket.on("post:liked", (data) => {
    io.emit("post:like", data);
  });

  socket.on("post:commented", (data) => {
    io.emit("post:comment", data);
  });

  socket.on("notification:new", (data) => {
    io.emit("notification", data);
  });

  socket.on("disconnect", () => {
    console.log("[realtime] client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[realtime] socket.io server on port ${PORT}`);
});
