import express from "express";
import { addProduct, updateQuantity, deleteProduct, getProducts, getProductsById, updateProduct } from "../controller/products.controller.js";
const route=express.Router();
//adding products
route.post("/product/:id",addProduct);


//getting products
route.get('/:id',getProducts)
route.get('/:id/:productId',getProductsById)

//update products
route.patch('/:id/:productId',updateProduct)
route.patch('/:id/:productId',updateQuantity)

//delete products
route.delete('/:id/:productId',deleteProduct)
export default route;