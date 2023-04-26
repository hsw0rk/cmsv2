import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM employeemaster WHERE employeecode = ?";

  db.query(q, [req.body.employeecode], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO employeemaster (`employeecode`,`employeename`,`mobilenumber`,`password`) VALUE (?)";

    const values = [
      req.body.employeecode,
      req.body.employeename,
      req.body.mobilenumber,
      hashedPassword,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created!");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM employeemaster WHERE employeecode = ?";

  db.query(q, [req.body.employeecode], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};

// export const investments = (req, res) => {
//   //CHECK IF INVESTMENT EXISTS

//   const q = "SELECT * FROM cmsverticalform WHERE pan = ?";

//   db.query(q, [req.body.pan], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("Investment already exists!");
//     //CREATE A NEW INVESTMENT

//     const q =
//       "INSERT INTO cmsverticalform (`principal`,`product`,`freshrenewal`,`pan`,`mobileno`,`customername`,`creditbranch`,`business`,`vertical`,`employeename`,`employeecode`) VALUES (?)";

//     const values = [
//       req.body.principal,
//       req.body.product,
//       req.body.freshrenewal,
//       req.body.pan,
//       req.body.mobileno,
//       req.body.customername,
//       req.body.creditbranch,
//       req.body.business,
//       req.body.vertical,
//       req.body.employeename,
//       req.body.employeecode,
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("Investment has been added!");
//     });
//   });
// };

export const investments = (req, res) => {
  const q = "INSERT INTO cmsverticalform (`principal`,`product`,`freshrenewal`,`pan`,`mobileno`,`customername`,`creditbranch`,`business`,`vertical`,`employeename`,`employeecode`) VALUES (?)";

  const values = [
    req.body.principal,
    req.body.product,
    req.body.freshrenewal,
    req.body.pan,
    req.body.mobileno,
    req.body.customername,
    req.body.creditbranch,
    req.body.business,
    req.body.vertical,
    req.body.employeename,
    req.body.employeecode,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Investment has been created!");
  });
};
