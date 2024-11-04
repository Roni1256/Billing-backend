import express from "express";
import { signup, login, logout ,presentUser, updateProfile } from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";

const route=express.Router();

route.post("/signup",signup);
route.post("/login",login);
route.get("/logout",logout);
route.get("/present/:id",presentUser)
route.patch("/:id",updateProfile);
export default route;
