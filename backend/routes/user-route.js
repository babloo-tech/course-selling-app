import express from "express";
const router=express.Router();
import { login, logout, purchases, signup } from "../controllers/user.controller.js";
import userMiddlerware from "../middlewares/user.mid.js";

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.get("/purchases",userMiddlerware,purchases)

export default router;