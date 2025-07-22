import express from "express";
const productsRoute = express.Router();
import { createProduct, getAllProducts, deleteOne, prdsearch } from "../controlers/productControler.js";
import upload from "../middlewares/multerUpload.js";
import { verifyJWT, authorizeRoles, validOwnership } from "../middlewares/authMiddleware.js";

productsRoute.route("/register-product")
.post(
    upload.single('image'),
    createProduct
)
productsRoute.route("/getallproducts").get(verifyJWT, getAllProducts);

productsRoute.route("/deleteOne")
.post(verifyJWT, validOwnership, authorizeRoles("seller", "supervisor", "admin"), deleteOne)
.delete(verifyJWT, authorizeRoles("supervisor", "admin"), deleteOne);

productsRoute.route("/search").post(prdsearch);


export default productsRoute;