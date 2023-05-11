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
  branchdata,
  editbranch,
  adminbranch,
  userdata,
  edituser,
  adminuser,
  approvaldata,
  editapproval,
  adminapproval,
  getbrancheinuser
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
router.get("/branchdata", branchdata);
router.put("/editbranch/:id", editbranch);
router.post("/adminbranch", adminbranch);
router.get("/userdata", userdata);
router.put("/edituser/:id", edituser);
router.post("/adminuser", adminuser);
router.get("/getbrancheinuser", getbrancheinuser);
router.get("/approvaldata", approvaldata);
router.put("/editapproval/:id", editapproval);
router.put("/adminapproval", adminapproval);

export default router;