import mongoose from "mongoose";
import productSchema from "./product.model.js";
const customerSchema = new mongoose.Schema({
    invoice_number:{
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: Number,
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    products:{
        type:[productSchema]
    },
    totalPrice:{
        type: Number,
        required: true,
        trim: true
    },
    totalItems:{
        type: Number,
        required: true,
        trim: true
    }

},{
    timestamps:true
})

export default customerSchema;