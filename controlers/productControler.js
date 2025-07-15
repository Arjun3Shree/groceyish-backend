import { productService } from "../services/productService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const { uploadImageToCloudinary, createProductInDb, deleteOnePrd, getAllProductsFromDB } = productService;

/**
 * Controller to handle product creation, including image upload to Cloudinary
 * and saving product details to MongoDB.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */

const createProduct = asyncHandler(async (req, res) => {
    try{
        // console.log("req.body:", req.body);
        // console.log("req.file:", req.file);

        const {name, price, quantity, typequant, catagory, owner } = req.body;
        if(!name || !price || !quantity || !typequant || !catagory || !owner){
            return new ApiError(400, "All fields are require!")
        }

        let imageUrl = null;
        let imagePublicId = null;
        if(req.file){
            const fileBuffer = req.file.buffer;
            const mimeType = req.file.mimetype;
            const cloudinaryResult = await uploadImageToCloudinary(fileBuffer, mimeType);

            imageUrl = cloudinaryResult.secure_url;
            imagePublicId = cloudinaryResult.public_id;
        }else{
            console.warn("No image file provided for the product.")
        }

        const procuctData = {
            name,
            price,
            quantity,
            typequant,
            catagory,
            owner,
            imageurl: imageUrl,
            imagePublicId: imagePublicId
        };
        const newProduct = await createProductInDb(procuctData);
        res.status(201)
        .json(
            new ApiResponse(201,{newProduct},"Product created Successfully!!")
        )
    }catch(error){
        console.error("Error while creating product.", error);

        if(error instanceof ApiError){
            return res.status(error.statusCode).json(
                new ApiResponse(500, null, error.message)
            );
        }

        return res.status(500).json(
            new ApiResponse(500, null, error.message || "Internal server error during product creation.")
        )
    }
});

const getAllProducts = asyncHandler( async (req, res) => {
    try{
        const products = await getAllProductsFromDB();
        if(!products || products.length === 0){
            return res.status(200).json(
                new ApiResponse(200, [], "No products found.")
            )
        }
        res.status(200).json(
            new ApiResponse(200, products, "Products recived succefully.")
        )
    }catch(error){
        console.log("Error while reciveing products: ", error);
        throw new ApiError(400, "Error while reciving products.")
    }
});

const deleteOne = asyncHandler( async(req, res)=> {
    const {pId, pName} = req.body;
    if(!pId || !pName){
        return new ApiError(400, "Missing Product id or Name.")
    }
    const deleteResult = await deleteOnePrd(pId, pName);

    return res.status(200).json(new ApiResponse(200, deleteResult, "Product Delete successfully."))

});

const prdsearch = asyncHandler(async(req, res)=>{
    let searchq = req.params.keyname;
    let searchq1 = req.params.keyname1;
    res.status(200).json(new ApiResponse(200, {searchq, searchq1}, "Recived keyword..."))
})

export { createProduct, getAllProducts, deleteOne, prdsearch };