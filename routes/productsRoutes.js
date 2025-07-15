import express from "express";
const productsRoute = express.Router();
import { createProduct, getAllProducts, deleteOne, prdsearch } from "../controlers/productControler.js";
import upload from "../middlewares/multerUpload.js";

productsRoute.route("/register-product")
.post(
    upload.single('image'),
    createProduct
)
productsRoute.route("/getallproducts").get(getAllProducts)
productsRoute.route("/deleteOne").post(deleteOne)
productsRoute.route("/search/:keyname/:keyname1").post(prdsearch)


export default productsRoute;