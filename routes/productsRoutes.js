import express from "express";
const productsRoute = express.Router();
import { createProduct, createOnePrd, getAllProducts, deleteOne, prdsearch } from "../controlers/productControler.js";
import upload from "../middlewares/multerUpload.js";
import { verifyJWT, authorizeRoles, validOwnership } from "../middlewares/authMiddleware.js";

productsRoute.route("/register-product")
.post(
    verifyJWT,
    upload.single('file'),
    createProduct
)
productsRoute.route("/add-new-product")
.post(
    createOnePrd
)
productsRoute.route("/getallproducts").get(verifyJWT, getAllProducts);

productsRoute.route("/deleteOne")
.post(verifyJWT, validOwnership, authorizeRoles("seller", "supervisor", "admin"), deleteOne)
.delete(verifyJWT, authorizeRoles("supervisor", "admin"), deleteOne);

productsRoute.route("/search").post(prdsearch);


export default productsRoute;