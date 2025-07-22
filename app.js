import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // This is use for sending/reciving cookies.
}));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import authRoute from "./routes/authRoutes.js";
import productsRoute from "./routes/productsRoutes.js";
app.use("/api/auth", authRoute);
app.use("/api/product", productsRoute);

export { app }