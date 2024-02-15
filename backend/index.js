import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth.js";
import userRouter from "./routes/User.js";
import noteRouter from "./routes/Note.js";
import protect from "./middlewares/Auth.js";
import errorHandler from "./middlewares/Error.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/users", protect, userRouter);
app.use("/api/notes", protect, noteRouter);
// static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.use(errorHandler);

// connect to db
const { PORT, MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
