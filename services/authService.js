import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const refil = async () => {
    User.updateMany(
        { usertype: { $exists: false } },
        { $set: { usertype: "customer" } }
    );

    User.updateMany(
        { usertype: null },
        { $set: {usertype: "customer" }}
    );
}

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found for token generaation!")
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save( { validateBeforeSave: false } );

        return { accessToken, refreshToken };

    }catch(err){
        throw new ApiError(500, "Something went wront while generating access and refresh tokens");
    }
};

const registerUser = async ( email, password, usertype ) => {
    if([ email, password ].some(field=> field?.trim() === "")){
        throw new ApiError(409, "All filds are required")
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(409, "User alredy Exists");
    }

    const user = await User({
        email: email.toLowerCase(),
        password,
        usertype
    }).save();
    if(!user){
        throw new ApiError(500, "Something went wrong while creating the user!!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return {
        user: createdUser,
        accessToken,
        refreshToken
    };
};

const loginUser = async (email, password) => {
    if([ email, password ].some(field=> field?.trim() === "")){
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User dose not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid user credentials");
        return null;
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken");

    return{
        user: loggedInUser,
        accessToken,
        refreshToken
    };
};

const logoutUser = async (userId) => {
    const user = User.findByIdAndUpdate(userId, {
        $set: {refreshToken: null }
    },
    { new: true}
    );

    if(!user){
        throw new Error(404, "User not found for logout!");
    }

    return true;
};

const refreshAccessToken = async (oldRefreshToken) => {
    if(!oldRefreshToken){
        throw new ApiError(401, "API token is missing")
    }

    try{
        const decodedToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if(!user){
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        if(oldRefreshToken !== user,refreshToken){
            throw new ApiErro( 401, "Refresh token is expired or is invalid");
        }

        const { accessToken, refreshToken:newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return { accessToken, refreshToken:newRefreshToken };

    }catch(error){
        if(error.name === 'TokenExpiredError'){
            throw new ApiError(401, "Refresh Token Expired");
        }
        if(error.name === 'JsonWebTokenError'){
            throw new ApiError(401, "Invalid refresh token")
        }
        throw new ApiError(500, error.message || "Failed to refresh access token")
    }
};

export const authService = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    refil
}