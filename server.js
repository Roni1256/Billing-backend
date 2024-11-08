import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import customerRoute from './routes/customer.route.js'
import companyRoute from './routes/company.route.js'
import adminRoute from './routes/admin.route.js'
const app=express()
dotenv.config()
const PORT =process.env.PORT || 5000;

app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        methods:'GET,POST,PUT,DELETE,PATCH',
        credentials:true
    }
))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


await mongoose.connect(String(process.env.MONGO_URI)).then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)   
    })
})
.catch((error) => {
    console.log(error)
})


app.get('/',(req,res)=>{
    res.send('Billing Backend!')
})
app.use('/user',userRoute);
app.use('/products',productRoute);
app.use('/customer',customerRoute);
app.use('/company',companyRoute);
app.use('/admin',adminRoute);



