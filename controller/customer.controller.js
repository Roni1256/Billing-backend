import User from "../models/user.model.js";
import nodemailer from 'nodemailer';


const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: options.email,
        subject: "Billing App",
        html: `
            <h2>Your Bill Details</h2>
            <p><strong>Invoice Number:</strong> ${options.invoice_number}</p>
            <p><strong>Total Items:</strong> ${options.totalItems}</p>
            <p><strong>Total Price:</strong> ${options.totalPrice}</p>
            <h3>Products:</h3>
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                </tr>
                ${options.products.map(product => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${product.userquantity}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${product.price}</td>
                    </tr>
                `).join('')}
            </table>`
    };
    await transporter.sendMail(mailOptions);
};



export const addCustomer=async(req,res)=>{
    const { invoice_number, name, email, phone,address, products, totalPrice, totalItems } = req.body;
    const { id } = req.params;
    try {
        
        if (products.length === 0) return res.status(400).json({ message: "No products found" });
        const isUser = await User.findById(id);
        if (!isUser) return res.status(404).json({ message: "User not found" });

        const customerObject = {
            invoice_number,
            name,
            email,
            phone,
            address,
            products,
            totalPrice,
            totalItems,
        };
        isUser.customers.push(customerObject);
        for (const product of products) {
            const productFound = isUser.products.find(prod => prod._id.toString() === product._id);
            if (productFound) {
                productFound.quantity -= Number(product.userquantity);
                const newsold={
                    sold:Number(product.userquantity),
                }
                productFound.sold.push(newsold);
                await User.findOneAndUpdate(
                    { _id: id, "products._id": product._id },
                    { $set: { "products.$.quantity": productFound.quantity } },
                    {$set: { "products.$.sold": productFound.sold } },
                )
                
            }
        }        isUser.totalsales+=products.length
        if(email)
            await sendMail({ email, totalPrice, totalItems , products,invoice_number});
        await isUser.save();
        return res.status(201).json(isUser);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteCustomer=async(req,res)=>{
    const {id,customerId}=req.params;
    try{
        const isUser=await User.findById(id);
        if(!isUser)return res.status(401).json({message:"User not found"});

        const index=isUser.customers.indexOf(isUser.customers.find(customer=>customer.id==customerId));


        isUser.customers.splice(index,1);
        await isUser.save();

        return res.status(200).json(isUser);
    }catch(error){
        res.status(500).json({message:error.message})
    }
}


export const notifyCustomer=async(req,res)=>{
    const {subject,message,title}=req.body;
    const {id}=req.params

   
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    const sendNotify = async ({ email, subject,title, message }) => {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: subject,
            html: `
            <h2>${title}</h2>
            <p>${message}</p>
            `
        };
    
        await transporter.sendMail(mailOptions);
    };
    



    try{
        const isUser=await User.findById(id);
        if(!isUser)return res.status(401).json({message:"User not found"});
        const customer_email = [...new Set(isUser.customers.map((customer) => {
            if(customer.email)
                return customer.email
        }))];
        console.log(customer_email);
        
        customer_email.filter(email => email).forEach(async(email) => await sendNotify({email, title,subject, message}));
        return res.status(200).json({message:"Mail sent successfully"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getAllCustomers=async(req,res)=>{
    const {id}=req.params;
    try{
        const isUser=await User.findById(id);
        if(!isUser)return res.status(401).json({message:"User not found"});
        return res.status(200).json(isUser.customers);
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}