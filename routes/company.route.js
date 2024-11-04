import express from "express";
import { updatecompany } from "../controller/company.controller.js";

const route=express.Router();

route.patch("/:id",updatecompany);
export default route;
