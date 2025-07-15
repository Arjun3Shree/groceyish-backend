import express from "express";
import authRoute from "./routes/authRoutes.js";
import productsRoute from "./routes/productsRoutes.js";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/product", productsRoute);

export { app }