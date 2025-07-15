import express from "express";
const authRoute = express.Router();
import { registerUser, loginUser, logOut, refreshAccessToken, replacetype } from "../controlers/authControler.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

authRoute.route("/register").post(registerUser);
// authRoute.route("/recorrect").get(replacetype);
authRoute.route("/login").post(loginUser);
authRoute.route("/refresh-token").post(refreshAccessToken);
// authRoute.post("/refresh-token", refreshAccessToken);

authRoute.route("/logout").post(verifyJWT, logOut);



export default authRoute;