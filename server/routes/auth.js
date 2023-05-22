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
  getverticalName,
  approvaldata,
  editapproval,
  adminapproval,
  getregioninuser,
  getverticalCode,
  getbranchadd,
  adminproduct,
  getverticalinbranch,
  getprincipalininsurance,
  getprincipalininvestments,
  principaldata,
  editprincipal,
  adminprincipal,
  getverticalinprincipal,
  getproductinprincipal
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
router.get("/getverticalinbranch", getverticalinbranch);

router.get("/userdata", userdata);
router.put("/edituser/:id", edituser);
router.post("/adminuser", adminuser);
router.get("/getbranchinuser", getbranchinuser);
router.get("/getregioninuser", getregioninuser);

router.get("/getproductininvestments", getproductininvestments);
router.get("/getprincipalininsurance", getprincipalininsurance);
router.get("/getprincipalininvestments", getprincipalininvestments);

router.get("/getverticalName", getverticalName);
router.get("/getverticalCode/", getverticalCode);
router.get("/getbranchadd/", getbranchadd);

router.get("/verticaldata", verticaldata);
router.put("/editvertical/:id", editVertical);
router.post("/adminvertical", adminvertical);

router.get("/productdata", productdata);
router.put("/editproduct/:id", editProduct);
router.post("/adminproduct", adminproduct);

router.get("/principaldata", principaldata);
router.put("/editprincipal/:id", editprincipal);
router.post("/adminprincipal", adminprincipal);
router.get("/getverticalinprincipal", getverticalinprincipal);
router.get("/getproductinprincipal", getproductinprincipal);

router.get("/approvaldata", approvaldata);
router.put("/editapproval/:id", editapproval);
router.put("/adminapproval", adminapproval);



export default router;