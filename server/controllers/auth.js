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
      return res.status(200).json("User has been created.");
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
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};


export const investments = (req, res) => {
// investments server
app.post('http://localhost:8800/api/investments', (req, res)=>{
  // get variables from the form
  const sentprincipal = req.body.principal
  const sentproduct = req.body.product
  const sentFreshRenewal = req.body.FreshRenewal
  const sentpan = req.body.pan
  const sentmobileno = req.body.mobileno
  const sentcustomername = req.body.customername
  const sentcreditbranch = req.body.creditbranch
  const sentbusiness = req.body.business
  const sentvertical = req.body.vertical
  const sentemployeename = req.body.employeename
  const sentemployeecode = req.body.employeecode
 

  // Creating SQL statement to insert user to the database table users
  const SQL = `INSERT INTO cmsverticalform (principal, product, FreshRenewal,pan,mobileno,customername,creditbranch,business,vertical,employeename,employeecode) VALUES (?, ?, ?,?,?,?,?,?,?,?,?)`;
  const VALUES = [sentprincipal, sentproduct, sentFreshRenewal,sentpan,sentmobileno,sentcustomername,sentcreditbranch,sentbusiness,sentvertical,sentemployeename ,sentemployeecode]

  // Query to execute the sql statement stated above
  db.query(SQL, VALUES, (err, results)=>{
      if(err){
          res.send(err)
      }
      else{
          console.log('User inserted successfully!')
          res.send({message: 'User added!'})
      }
  })
})
}