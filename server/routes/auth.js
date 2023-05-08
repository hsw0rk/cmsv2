import express from "express";
import {
  login,
  register,
  logout,
  investments,
  cmsverticalformdata,
  regiondata,
  editRegion,
  adminregion,
  investmentsCount,
  homeloansCount,
  insuranceCount,
  orderbookCount,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/investments", investments);
router.get("/cmsverticalformdata", cmsverticalformdata);
router.get("/regiondata", regiondata);
router.put("/editregion/:id", editRegion);
router.post("/adminregion", adminregion);
router.get("/investmentscount", investmentsCount);
router.get("/homeloanscount", homeloansCount);
router.get("/insurancecount", insuranceCount);
router.get("/orderbookcount", orderbookCount);

export default router;
