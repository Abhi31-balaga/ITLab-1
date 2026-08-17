<<<<<<< HEAD
import './src/server.js';
=======
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/health", (req, res) => {
  res.send("health OK!");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
>>>>>>> e59b91d178413da62178c45187e33838f23100ae
