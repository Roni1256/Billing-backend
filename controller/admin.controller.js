import User from "../models/user.model.js";

export const adminLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password) return res.status(400).json({message:"All fields are required"});
        if(email!==process.env.ADMIN_EMAIL || password!==process.env.ADMIN_PASSWORD) return res.status(401).json({message:"Invalid credentials"});
        return res.status(200).json({message:"Login successful"});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getAllUsers=async(req,res)=>{ 
    try{
        const users=await User.find({}).select("-password");
        return res.status(200).json(users);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try{
        const user=await User.findByIdAndDelete(id);
        if(!user) return res.status(404).json({message:"User not found"});
        return res.status(200).json({message:"User deleted"});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deleteAllUser=async(req,res)=>{
    try{
        await User.deleteMany({});
        return res.status(200).json({message:"All users deleted"});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}
