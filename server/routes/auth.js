import express from "express";
import { login,register,logout,investments,cmsverticalformdata } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.post("/investments", investments)
router.get("/cmsverticalformdata", cmsverticalformdata)


export default router