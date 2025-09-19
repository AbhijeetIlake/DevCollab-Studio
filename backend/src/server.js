const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const fileRoutes = require("./routes/files");
const collabRoutes = require("./routes/collab");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }, // tighten for production
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", fileRoutes);
app.use("/api/collab", collabRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "DevCollab backend running" });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Example: you can handle file/project collaboration events here
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
