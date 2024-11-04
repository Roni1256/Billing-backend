import User from "../models/user.model.js";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

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

const sendNotify=async(options)=>{
   
    const mail={
        from:process.env.SMTP_FROM,
        to: options.email,
        subject:options.subject,
        text:options.message
    };
    await transporter.sendMail(mail)
    .then(console.log("Mail Sent"))
    .catch(console.error);
}


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
            
            console.log(isUser.products[0]._id.toString());            
            const productFound = isUser.products.find(prod => prod._id.toString() === product._id);
            console.log(productFound);
            
            
            if (productFound) {
                productFound.quantity -= Number(product.userquantity);
                console.log(productFound.quantity);
                
                await User.findOneAndUpdate(
                    { _id: id, "products._id": product._id },
                    { $set: { "products.$.quantity": productFound.quantity } }
                )
                
            }
        }        isUser.totalsales+=products.length
        if(email)
            await sendMail({ email, totalPrice, totalItems , products });
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
    const {subject,message}=req.body;
    const {id}=req.params
    try{
        const isUser=await User.findById(id);
        if(!isUser)return res.status(401).json({message:"User not found"});
        const customer_email = [...new Set(isUser.customers.map((customer) => {
            if(customer.email)
                return customer.email
        }))];
        console.log(customer_email);
        
        customer_email.map(email=>sendNotify({email,subject,message}));
        return res.status(200).json({message:"Mail sent successfully"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}