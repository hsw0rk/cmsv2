import express from "express";
import {
  login,register,currentuser,updateSessionActivity,heartbeat,logout,

  investments,getproductininvestments,getprincipalininvestments,

  getprincipalininsurance,

  cmsverticalformdata,

  regiondata,editRegion,adminregion,

  investmentsCount,homeloansCount,insuranceCount,orderbookCount,

  branchdata,editbranch,adminbranch,getverticalinbranch,

  userdata,edituser,adminuser,getbranchinuser,getregioninuser,getverticalinuser,getbusinessinuser,getregionheadinuser,getverticalheadinuser,getbranchadd,

  verticaldata,editVertical,adminvertical,

  productdata,editProduct,adminproduct,

  getverticalName,getverticalCode,

  approvaldata,approval,

  principaldata,editprincipal,adminprincipal,getverticalinprincipal,getproductinprincipal,

  businessheaddata,editbusinesshead,adminbusinesshead,getverticalinbusinesshead,

  regionheaddata,editregionhead,adminregionhead,
 
  verticalheaddata,editverticalhead,adminverticalhead,getverticalinverticalhead,getbusinessinverticalhead,getregioninverticalhead,getregionheadinverticalhead,

  coheaddata,editcoheadmaster,adminco,

  employeelead,dashboardlead,

  leaduserdata,adminleaddata,adminlead
  
} from "../controllers/auth.js";



const router = express.Router();

//auth
router.post("/login", login);
router.post("/register", register);
router.get("/currentuser", currentuser);
router.post("/activity", updateSessionActivity);
router.post("/heartbeat", heartbeat);
router.post("/logout", logout);

//investments
router.post("/investments", investments);
router.get("/getproductininvestments", getproductininvestments);
router.get("/getprincipalininvestments", getprincipalininvestments);

//insurance
router.get("/getprincipalininsurance", getprincipalininsurance);

//orderbook
router.get("/cmsverticalformdata", cmsverticalformdata);

//leads
router.get("/employeelead", employeelead);
router.get("/dashboardlead", dashboardlead);

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
router.get("/getregioninuser", getregioninuser);
router.get("/getbranchinuser", getbranchinuser);
router.get("/getverticalinuser", getverticalinuser);
router.get("/getbusinessinuser", getbusinessinuser);
router.get("/getregionheadinuser", getregionheadinuser);
router.get("/getverticalheadinuser", getverticalheadinuser);

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
router.post("/adminbusinesshead", adminbusinesshead);
router.get("/getverticalinbusinesshead", getverticalinbusinesshead);

//regionheadmaster
router.get("/regionheaddata", regionheaddata);
router.put("/editregionhead/:id", editregionhead);
router.post("/adminregionhead", adminregionhead);

//verticalheadmaster
router.get("/verticalheaddata", verticalheaddata);
router.put("/editverticalhead/:id", editverticalhead);
router.post("/adminverticalhead", adminverticalhead);
router.get("/getverticalinverticalhead", getverticalinverticalhead);
router.get("/getbusinessinverticalhead", getbusinessinverticalhead);
router.get("/getregioninverticalhead", getregioninverticalhead);
router.get("/getregionheadinverticalhead", getregionheadinverticalhead);

//coheadmaster
router.get("/coheaddata", coheaddata);
router.put("/editcoheadmaster/:id", editcoheadmaster);
router.post("/adminco", adminco);

//approvalmaster
router.get("/approvaldata", approvaldata);
router.post("/approval/:id", approval);

//leadadmin
router.get("/leaduserdata", leaduserdata);
router.get("/adminleaddata", adminleaddata);
router.post("/adminlead", adminlead);


export default router;