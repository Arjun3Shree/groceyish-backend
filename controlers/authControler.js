import { authService } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const replacetype = asyncHandler(async(req,res)=>{
    const ans = await authService.refil();
})

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, usertype } = req.body;

    if(!email || !password){
        throw new ApiError(400, "All fields are require");
    }

    const { user, accessToken, refreshToken } = await authService.registerUser(email, password, usertype);

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'Lax'
    }

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            201,
            { user, accessToken, refreshToken},
            "User registered succesfully"
        )
    );
});

const loginUser = asyncHandler( async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400, "Email and Password are require");
    }
    
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'Lax'
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            { user, accessToken, refreshToken },
            "User login successfully"
        )
    );

});

const logOut = asyncHandler(async(req,res)=>{
    await authService.logoutUser(req.user._id);

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'Lax'
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));

});

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incommingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(incommingRefreshToken);

    const options = {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'Lax'
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(200,
            { accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    );
});

export {
    registerUser,
    loginUser,
    logOut,
    refreshAccessToken,
    replacetype
}


