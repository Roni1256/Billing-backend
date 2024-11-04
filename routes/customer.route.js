import express from "express";
import { addCustomer, deleteCustomer, notifyCustomer } from "../controller/customer.controller.js";

const route=express.Router();
route.post('/:id',addCustomer);
route.delete('/:id/:customerId',deleteCustomer)
route.post('/notify/:id',notifyCustomer)


export default route;