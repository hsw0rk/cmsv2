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
  getbranchinuser,
  verticaldata,
  editVertical,
  adminvertical,
  productdata,
  editProduct,
  getproductininvestments,
  getverticalininvestments,
  approvaldata,
  editapproval,
  adminapproval,
  getregioninuser,
  getverticalinhomeloans,
  getverticalininsurance,
  getbranchadd
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
router.get("/getbranchinuser", getbranchinuser);
router.get("/getregioninuser", getregioninuser);
router.get("/getproductininvestments", getproductininvestments);
router.get("/getverticalininvestments/", getverticalininvestments);
router.get("/getverticalinhomeloans/", getverticalinhomeloans);
router.get("/getverticalininsurance/", getverticalininsurance);
router.get("/getbranchadd/", getbranchadd); 

router.get("/verticaldata", verticaldata);
router.put("/editvertical/:id", editVertical);
router.post("/adminvertical", adminvertical);
router.get("/productdata", productdata);
router.put("/editproduct/:id", editProduct);
router.get("/approvaldata", approvaldata);
router.put("/editapproval/:id", editapproval);
router.put("/adminapproval", adminapproval);


export default router;