import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const products = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            lowercase: true,
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            trim: true
        },
        quantity: {
            type: Number,
            required: true
        },
        availablequant:{
            type: Number,
            default: 1
        },
        typequant: {
            type: String,
            required: true
        },
        catagory: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: [true, "Owner name is require"],
            lowercase: true
        },
        imageurl: {
            type:String
        },
        imagePublicId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Products = mongoose.model("Products", products);