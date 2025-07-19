import cloudinary from "../config/cloudinaryConfig.js";
import { Products } from "../models/productsModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<object>} - Cloudinary upload result.
 */

const uploadImageToCloudinary = async (fileBuffer, mimeType) => {
    try{
        const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'Grocery-app',
            resource_type: 'auto'
        });
        return result;
    }catch(error){
        console.error("Cloudinary upload error:", error);
        throw new ApiError("Failed to upload image to cloudinary");
    }
};

const deleteImageFromCloudinary = async(publicId) => {
    try{
        if(!publicId){
            return null;
        }
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);

        if(result.result !== 'ok'){
            console.error("Cloudinary deletation failed for publicId:", publicId, "Result: ", result);
            return false;
        }
        return true;
    }catch(error){
        console.error("Error while deleting from cloudinary:", error);
        throw new ApiError("Failed to delete image from cloudinary.");
    }
}

const validOwnership = async (pid, wid) => {
    const product = await Products.findById(pid);
    if(!product){
        return new ApiResponse(400, null, "Product not found!")
    }
    if(product.owner._id.toString() !== wid){
        return false;
    }
    return true;
}

/**
 * Creates a new product in the database.
 * @param {object} productData - The product data to save.
 * @returns {Promise<object>} - The saved product document.
 */

const createProductInDb = async (productData) => {
    try{
        const newProduct = new Products(productData);
        await newProduct.save();
        return newProduct;
    }catch(error){
        console.error("Database save error wile product:", error);
        throw new ApiError("Failed to save product to the database.");
    }
};

const getAllProductsFromDB = async () => {
    try{
        const products = await Products.find({});
        return products;
    }catch(error){
        console.error("Database retrival errors while fetching products: ", error);
        throw new ApiError(500, "Failed to retrive products from the database.")
    }
}

const deleteOnePrd = async (productId, productName, wid) => {
    if(!productId || !productName){
        throw new ApiError(400, "ProductId and product name are required.")
    }
    try{
        const productToDelete = await Products.findOne({_id:productId, name: productName.toLowerCase() });
        if(!productToDelete){
            throw new ApiError(400, "Product not found or name didn't match!")
        }
        if(productToDelete.imagePublicId){
            const cloudinaryDeleteSuccess = await deleteImageFromCloudinary(productToDelete.imagePublicId);
            if(!cloudinaryDeleteSuccess){
                console.warn(`Failed to delete image from Cloudinary for product_id${productId}. Public_id: ${productId.imagePublicId}.`);
            }
        }

        const result = await Products.deleteOne({_id:productId});
        if(result.deletedCount === 0){
            throw new ApiError(400, "Product not found for deletation after image processing.")
        }
        return { message: "Product deleted successfully"};
    }catch(error){
        if(error instanceof ApiError){
            throw error;
        }
        console.error(`Error while deleteing productId:${productId} Error: ${error}`);
        throw new ApiError(500, "Some thing went wrong while deleting Product.")
    }
}

export const productService = {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    createProductInDb,
    deleteOnePrd,
    getAllProductsFromDB,
    validOwnership
};