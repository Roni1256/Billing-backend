import express from "express";
import { addCustomer, deleteCustomer, notifyCustomer, getAllCustomers } from "../controller/customer.controller.js";

const route=express.Router();


route.get('/:id',getAllCustomers)
route.post('/:id',addCustomer);
route.delete('/:id/:customerId',deleteCustomer)
route.post('/notify/:id',notifyCustomer)


export default route;