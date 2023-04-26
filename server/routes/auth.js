import express from "express";
import { login,register,logout,investments } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.post("/investments", investments)


export default router