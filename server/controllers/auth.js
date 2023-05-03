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
    if (err) return res.status(500).json("User not found!");
    if (data.length === 0) return res.status(404).json("Fill the Fileds");

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

export const investments = (req, res) => {
  const principal = req.body.principal;
  const product = req.body.product;
  const freshrenewal = req.body.freshrenewal;
  const pan = req.body.pan;
  const mobileno = req.body.mobileno;
  const customername = req.body.customername;
  const creditbranch = req.body.creditbranch;
  const business = req.body.business;
  const vertical = req.body.vertical;
  const employeename = req.body.employeename;
  const employeecode = req.body.employeecode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM cmsverticalform WHERE principal = ? AND product = ? AND freshrenewal = ? AND pan = ? AND mobileno = ? AND customername = ? AND creditbranch = ? AND business = ? AND vertical = ?AND employeename = ?AND employeecode = ?";
  const values = [principal, product, freshrenewal, pan, mobileno, customername, creditbranch, business, vertical, employeename, employeecode];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, return an error response
      return res.status(400).json("Data already exists! Do you want to submit?");
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO cmsverticalform (`principal`,`product`,`freshrenewal`,`pan`,`mobileno`,`customername`,`creditbranch`,`business`,`vertical`,`employeename`,`employeecode`) VALUES (?)";

      const insertValues = [
        principal,
        product,
        freshrenewal,
        pan,
        mobileno,
        customername,
        creditbranch,
        business,
        vertical,
        employeename,
        employeecode,
      ];

      db.query(insertQuery, [insertValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Investment data has been created!");
      });
    }
  });
};



export const cmsverticalformdata = (req, res) => {
  const q = "SELECT * FROM cmsverticalform";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
