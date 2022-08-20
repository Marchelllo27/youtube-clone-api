import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// My imports
import userRoutes from "./routes/user-routes.js";
import videoRoutes from "./routes/video-routes.js";
import commentRoutes from "./routes/comment-routes.js";
import authRoutes from "./routes/auth-routes.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";

dotenv.config();
const app = express();

// Parsers
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// NOT FOUND PAGE
app.use((req, res) => res.status(404).json({ message: "Unfortunately page not found" }));

// ERROR HANDLING
app.use(errorHandlerMiddleware);

// CONNECTION TO THE DATABASE
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log(`Connected to mongodb`);

  const port = process.env.PORT || 4500;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});
