import User from "../models/user.model.js"

export const addProduct=async(req,res)=>{
    const {name,description,price,category,quantity}=req.body;
    const {id}=req.params;
    try{
        if(!name || !description || !price || !category || !quantity ) return res.status(400).json({message:"All fields are required"}); 
        const productObject={
            name,
            description,
            price:parseInt(price),
            category,
            quantity:parseInt(quantity),   
        }
        console.log(productObject);
        
        
            const user=await User.findById(id);
            if(!user) return res.status(404).json({message:"User not found"});
            user.products.push(productObject);
            await user.save();        
            return res.status(201).json(user);
        

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getProducts=async(req,res)=>{
    const {id}=req.params;
    try{ 
        const isUser=await User.findById(id);
        if(!isUser) return res.status(404).json({message:"User not found"});
        return res.status(200).json(isUser.products);
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getProductsById=async(req,res)=>{
    const {id,productId}=req.params;
    try{ 
        const isUser=await User.findById(id);
        if(!isUser) return res.status(404).json({message:"User not found"});

        const isProduct=isUser.products.find(product=>product.id==req.params.productId);

        if(!isProduct) return res.status(404).json({message:"Product not found"});

        return res.status(200).json(isProduct);
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateProduct=async(req,res)=>{
    const {id,productId}=req.params;
    try{ 
        const isUser=await User.findById(id);
        if(!isUser) return res.status(404).json({message:"User not found"});    

        const isProduct=isUser.products.find(product=>product.id==productId);

        if(!isProduct) return res.status(404).json({message:"Product not found"});

        const {name,description,price,category,stock}=req.body;

        const productObject={
            name,
            description,
            price,
            category,
            stock
        }
        isProduct.name=productObject.name;
        isProduct.description=productObject.description;
        isProduct.price=productObject.price;
        isProduct.category=productObject.category;
        isProduct.stock=productObject.stock;

        await isUser.save();

        return res.status(200).json(isUser);

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deleteProduct=async(req,res)=>{
    const {id,productId}=req.params;
    try{ 
        const isUser=await User.findById(id);
        if(!isUser) return res.status(404).json({message:"User not found"});

        const isProduct=isUser.products.find(product=>product.id==productId);

        if(!isProduct) return res.status(404).json({message:"Product not found"});

        const index=isUser.products.indexOf(isProduct);

        isUser.products.splice(index,1);

        await isUser.save();

        return res.status(200).json(isUser);

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateQuantity=async(req,res)=>{
    const {id,productId}=req.params;
    const {quantity}=req.body;
    try{ 
        const isUser=await User.findById(id);
        if(!isUser) return res.status(404).json({message:"User not found"});

        const isProduct=isUser.products.find(product=>product.id==productId);

        if(!isProduct) return res.status(404).json({message:"Product not found"});

        isProduct.quantity=quantity;

        await isUser.save();

        return res.status(200).json(isUser);

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}