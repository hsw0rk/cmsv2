import express from "express";
import {
  login,register,logout,

  investments,getproductininvestments,getprincipalininvestments,

  getprincipalininsurance,

  cmsverticalformdata,

  regiondata,editRegion,adminregion,

  investmentsCount,homeloansCount,insuranceCount,orderbookCount,

  branchdata,editbranch,adminbranch,getverticalinbranch,

  userdata,edituser,adminuser,getbranchinuser,getregioninuser,getbranchadd,

  verticaldata,editVertical,adminvertical,

  productdata,editProduct,adminproduct,

  getverticalName,getverticalCode,

  approvaldata,editapproval,adminapproval,

  principaldata,editprincipal,adminprincipal,getverticalinprincipal,getproductinprincipal,

  businessheaddata,editbusinesshead,
  // adminbusinesshead,
  // regionheaddata,
  // editregionhead

} from "../controllers/auth.js";

const router = express.Router();

//auth
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

//investments
router.post("/investments", investments);
router.get("/getproductininvestments", getproductininvestments);
router.get("/getprincipalininvestments", getprincipalininvestments);

//insurance
router.get("/getprincipalininsurance", getprincipalininsurance);

//orderbook
router.get("/cmsverticalformdata", cmsverticalformdata);

//regionmaster
router.get("/regiondata", regiondata);
router.put("/editregion/:id", editRegion);
router.post("/adminregion", adminregion);

//dashboardcounts
router.get("/investmentscount", investmentsCount);
router.get("/homeloanscount", homeloansCount);
router.get("/insurancecount", insuranceCount);
router.get("/orderbookcount", orderbookCount);

//branchmaster
router.get("/branchdata", branchdata);
router.put("/editbranch/:id", editbranch);
router.post("/adminbranch", adminbranch);
router.get("/getverticalinbranch", getverticalinbranch);

//employeemaster
router.get("/userdata", userdata);
router.put("/edituser/:id", edituser);
router.post("/adminuser", adminuser);
router.get("/getbranchinuser", getbranchinuser);
router.get("/getregioninuser", getregioninuser);

//Others
router.get("/getverticalName", getverticalName);
router.get("/getverticalCode/", getverticalCode);
router.get("/getbranchadd/", getbranchadd);

//verticalmaster
router.get("/verticaldata", verticaldata);
router.put("/editvertical/:id", editVertical);
router.post("/adminvertical", adminvertical);

//productmaster
router.get("/productdata", productdata);
router.put("/editproduct/:id", editProduct);
router.post("/adminproduct", adminproduct);

//principalmaster
router.get("/principaldata", principaldata);
router.put("/editprincipal/:id", editprincipal);
router.post("/adminprincipal", adminprincipal);
router.get("/getverticalinprincipal", getverticalinprincipal);
router.get("/getproductinprincipal", getproductinprincipal);

//businessheadmaster
router.get("/businessheaddata", businessheaddata);
router.put("/editbusinesshead/:id", editbusinesshead);
// router.post("/adminbusinesshead", adminbusinesshead);
// router.get("/getverticalinprincipal", getverticalinprincipal);
// router.get("/getproductinprincipal", getproductinprincipal);

//approvalmaster
router.get("/approvaldata", approvaldata);
router.put("/editapproval/:id", editapproval);
router.put("/adminapproval", adminapproval);

export default router;