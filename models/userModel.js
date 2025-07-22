import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const user = new Schema(
    {
        callsign: {
            type: String,
            default: "Active User"
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [ true, "password is required" ]
        },
        usertype : {
            type: String,
            default: "customer",
            enum: ["customer", "seller", "supervisor", "admin"]
        },
        listedProducts : [
            {
            type: Schema.Types.ObjectId,
            ref: "Products"
            }
        ],
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

user.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

user.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

user.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        usertype: this.usertype
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
}

user.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE}
    )
}

export const User = mongoose.model("User", user);