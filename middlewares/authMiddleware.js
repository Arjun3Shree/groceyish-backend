import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Products } from "../models/productsModel.js";

const verifyJWT = async( req, res, next ) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            throw new ApiError(401, "Access token expired plese refresh.");
        }
        if(error.name === 'JsonWebTokenError'){
            throw new ApiError(401, "Invalid access token.")
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
};

const verifyUser = async (userId) =>{
    const user = await User.findById(userId).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401, "Invalid user");
    }
    return user;
};

const validOwnership = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
        const prd = await Products.findById(req.body.pId)
        req.user = user;
        if(prd.owner._id.toString() !== decodedToken._id){
            return res.status(401).
            json(new ApiResponse(401, null, "Invalid owner access to delete"));
        }
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            throw new ApiError(401, "Access token expired plese refresh.");
        }
        if(error.name === 'JsonWebTokenError'){
            throw new ApiError(401, "Invalid access token.")
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
}

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.usertype){
            res.status(401)
            .json(new ApiError(401, "User role is not available."));
        }
        if(!allowedRoles.includes(req.user.usertype)){
            res.status(401).json( new ApiError(401, "User role is not authorized for this action."));
        }
        next();
    }
}

export {verifyJWT, verifyUser, validOwnership, authorizeRoles};