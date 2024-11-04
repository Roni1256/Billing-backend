import mongoose from 'mongoose'
import validator from 'validator'
import Product from './product.model.js'
import Customer from './customer.model.js'

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6,"Password must be at least 6 characters"],
        maxlength: 1024,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    products:{
        type:[Product],
    },
    customers:{
        type:[Customer]
    },
    company_name:{
        type: String,
        default: ''
    },
    business:{
        type: String,
        default: ''
    },
    invoicetype:{
        type: String,
        default: ''
    },
    slogan:{
        type: String,
        default: ''
    },
    address:{
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    state:{
        type: String,
        default: ''
    },
    country:{
        type: String,
        default: ''
    },
    pincode:{
        type: Number,
        default: 0
    },
    phone_number:{
        type: Number,
        default: 0
    },
    company_email:{
        type: String,
        default: ''
    },
    website:{
        type: String,
        default: ''
    },
    description:{
        type: String,
        default: ''
    },
    facebook_link:{
        type: String,
        default: ''
    },
    instagram_link:{
        type: String,
        default: ''
    },
    twitter_link:{
        type: String,
        default: ''
    },
    linkedin_link:{
        type: String,
        default: ''
    },
    totalsales:{
        type: Number,
        default: 0
    },
},{
    timestamps:true
}
)
const User = mongoose.model('User', userSchema)
export default User

