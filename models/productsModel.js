import mongoose, { Schema } from "mongoose";

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
            required: true,
            enum: ["vegi", "non-veg", "fruite", "grocery", "drinks"]
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner name is require"]
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