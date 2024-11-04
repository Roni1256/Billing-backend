import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const signup=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password) return res.status(400).json({message:"All fields are required"});

        const duplicate=await User.findOne({email});
        if(duplicate) return res.status(409).json({message:"Duplicate email"});

        const hashedPassword=await bcrypt.hash(password,10);
        const userObject={
            name,
            email,
            password:hashedPassword
        }
        const user=new User(userObject);
        const savedUser=await user.save();
        generateToken(savedUser._id,req,res);
        return res.status(200).json(savedUser);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

}


export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password) return res.status(400).json({message:"All fields are required"});
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(401).json({message:"Invalid credentials"});
        
        generateToken(user._id,req,res);
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json(userWithoutPassword);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token');
        return res.status(200).json({message:"Logout successful"});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const presentUser=async(req,res)=>{
    const {id}=req.params;
    try{
        const user=await User.findById(id).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});
        return res.status(200).json(user);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateProfile=async(req,res)=>{
    const {id}=req.params;
    const {name,email,address,phone_number}=req.body;
    try{
        const user=await User.findById(id);
        if(!user) return res.status(404).json({message:"User not found"});
        user.name=name || user.name;
        user.email=email || user.email;
        user.address=address || user.address;
        user.phone_number=phone_number || user.phone_number;
        const updatedUser=await user.save();
        return res.status(200).json(updatedUser);

    }catch(e){
        res.status(500).json({message:e.message})
    }
}


