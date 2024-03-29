import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true, // Allow cookies to be sent from the frontend
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
