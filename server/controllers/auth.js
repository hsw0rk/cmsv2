import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM usermaster WHERE employeecode = ?";

  db.query(q, [req.body.employeecode], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const q = "SELECT * FROM approvalmaster WHERE employeecode = ?";

    db.query(q, [req.body.employeecode], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Your details already sent for approval!");
      //CREATE A NEW USER
      //Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const q =
        "INSERT INTO approvalmaster (`employeecode`,`employeename`,`mobilenumber`,`password`) VALUE (?)";

      const values = [
        req.body.employeecode,
        req.body.employeename,
        req.body.mobilenumber,
        hashedPassword,
      ];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Sent for Approval!");
      });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM usermaster WHERE employeecode = ?";

  db.query(q, [req.body.employeecode], (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    if (data.length === 0) return res.status(404).json("User not found, Contact Admin");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Invalid employeecode/password");

    if (!req.body.employeecode || !req.body.password)
      return res.status(400).json("Fill the details");

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


export const investmentsCount = (req, res) => {
  const sql = "SELECT COUNT(id) as investments FROM cmsverticalform WHERE vertical = 'investments'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running investmentsCount query" });
    return res.json(result);
  });
};


export const homeloansCount = (req, res) => {
  const sql = "SELECT COUNT(id) as homeloans FROM cmsverticalform WHERE vertical = 'homeloans'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running homeloansCount query" });
    return res.json(result);
  });
}

export const insuranceCount = (req, res) => {

  const sql = "SELECT COUNT(id) as insurance FROM cmsverticalform WHERE vertical = 'insurance'";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running insuranceCount query" });
    return res.json(result);
  });
}

export const orderbookCount = (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(id) FROM cmsverticalform WHERE vertical = 'investments') as investments,
      (SELECT COUNT(id) FROM cmsverticalform WHERE vertical = 'homeloans') as homeloans,
      (SELECT COUNT(id) FROM cmsverticalform WHERE vertical = 'insurance') as insurance
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running orderbookCount query" });
    const count =
      (result[0].investments || 0) +
      (result[0].homeloans || 0) +
      (result[0].insurance || 0);
    return res.json([{ orderbook: count }]);
  });
};

/////////////////////////////////////////////////////
// Regionmaster
export const regiondata = (req, res) => {
  const q = "SELECT * FROM regionmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editRegion = (req, res) => {
  const id = req.params.id;
  const { regionname, regioncode } = req.body;
  const q = `UPDATE regionmaster SET regionname='${regionname}', regioncode='${regioncode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminregion = (req, res) => {
  const regionname = req.body.regionname;
  const regioncode = req.body.regioncode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM regionmaster WHERE regionname = ? AND regioncode = ?";
  const values = [regionname, regioncode];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE regionmaster SET regionname = ?, regioncode = ? WHERE regionname = ? AND regioncode = ?";
      const updateValues = [regionname, regioncode, regionname, regioncode];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Region data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO regionmaster (`regionname`,`regioncode`) VALUES (?)";

      const insertValues = [
        regionname,
        regioncode
      ];

      db.query(insertQuery, [insertValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Region data has been created!");
      });
    }
  });
};



//////////////////////////////////////////////////////

// Branchmaster
export const branchdata = (req, res) => {
  const q = "SELECT * FROM branchmaster";

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred while fetching branch data." });
    }
    return res.status(200).json(data);
  });
};


export const editbranch = (req, res) => {
  const id = req.params.id;
  const { regionname, regioncode, branchcode, branchname } = req.body;
  const q = `UPDATE branchmaster SET regionname='${regionname}', regioncode='${regioncode}', branchcode='${branchcode}', branchname='${branchname}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminbranch = (req, res) => {
  const regionname = req.body.regionname;
  const regioncode = req.body.regioncode;
  const branchcode = req.body.branchcode;
  const branchname = req.body.branchname;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
    "SELECT * FROM branchmaster WHERE regionname = ? AND regioncode = ? AND branchcode = ? AND branchname = ?";
  const values = [regionname, regioncode, branchcode, branchname];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
        "UPDATE branchmaster SET regionname = ?, regioncode = ?, branchname = ?, branchcode = ? WHERE regionname = ? AND regioncode = ? AND branchname = ? AND branchcode = ?";
      const updateValues = [
        regionname,
        regioncode,
        branchname,
        branchcode,
        regionname,
        regioncode,
        branchname,
        branchcode,
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Branch data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO branchmaster (`regionname`,`regioncode`,`branchcode`,`branchname`) VALUES (?, ?, ?, ?)";

      const insertValues = [
        regionname,
        regioncode,
        branchcode,
        branchname,
      ];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Branch data has been created!");
      });
    }
  });
};

/////////////////////////////////////////////////////////////////////////////////////
// Usermaster
export const userdata = (req, res) => {
  const q = "SELECT * FROM usermaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const edituser = (req, res) => {
  const id = req.params.id;
  const { employeename, employeecode, mobilenumber, password,regioncode,regionname,branchname,branchcode } = req.body;
  const q = `UPDATE usermaster SET employeename='${employeename}', employeecode='${employeecode}', mobilenumber='${mobilenumber}', password='${password}', regioncode='${regioncode}', regionname='${regionname}', branchname='${branchname}', branchcode='${branchcode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminuser = (req, res) => {
  const employeename = req.body.employeename;
  const employeecode = req.body.employeecode;
  const mobilenumber = req.body.mobilenumber;
  const password = req.body.password;
  const regioncode = req.body.regioncode;
  const regionname = req.body.regionname;
  const branchname = req.body.branchname;
  const branchcode = req.body.branchcode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM usermaster WHERE employeename = ? AND employeecode = ? AND mobilenumber = ? AND password = ? AND regioncode = ?AND regionname = ? AND branchname = ?AND branchcode = ?";
  const values = [employeename, employeecode, mobilenumber, password,regioncode,regionname,branchname,branchcode ];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE usermaster SET employeename = ? AND employeecode = ? AND mobilenumber = ? AND password = ? AND regioncode = ?AND regionname = ? AND branchname = ?AND branchcode = ?";
      const updateValues = [employeename, employeecode, mobilenumber, password,regioncode,regionname,branchname,branchcode ,employeename, employeecode, mobilenumber, password,regioncode,regionname,branchname,branchcode];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO Usermaster (`employeename`,`employeecode`,`mobilenumber`,`password`,`regioncode`,`regionname`,`branchname`,`branchcode`) VALUES (?)";

      const insertValues = [
        employeename,
        employeecode,
        mobilenumber,
        password,
        regioncode,
        regionname,
        branchname,
        branchcode
      ];

      db.query(insertQuery, [insertValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Branch data has been created!");
      });
    }
  });
};


export const getbranchinuser = (req, res) => {
  const q = "SELECT * FROM branchmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getregioninuser = (req, res) => {
  const q = "SELECT * FROM regionmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};


export const getproductininvestments = (req, res) => {
  const q = "SELECT * FROM productmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getverticalininvestments = (req, res) => {
  const q = "SELECT investmentsvt FROM verticalmaster WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data[0].investmentsvt);
  });
};

export const getverticalinhomeloans = (req, res) => {
  const q = "SELECT homeloansvt FROM verticalmaster WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data[0].homeloansvt);
  });
};

export const getverticalininsurance = (req, res) => {
  const q = "SELECT insurancevt FROM verticalmaster WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data[0].insurancevt);
  });
};


export const getbranchadd = (req, res) => {
  const q = "SELECT * FROM usermaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

// Verticalmaster
export const verticaldata = (req, res) => {
  const q = "SELECT * FROM verticalmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editVertical = (req, res) => {
  const id = req.params.id;
  const { investmentsvt, homeloansvt, insurancevt} = req.body;
  const q = `UPDATE verticalmaster SET investmentsvt='${investmentsvt}', homeloansvt='${homeloansvt}', insurancevt='${insurancevt}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminvertical = (req, res) => {
  const { columnname, verticalname } = req.body;

  // Check if column already exists in verticalmaster table
  const checkColumnQuery = `SELECT ${columnname} FROM verticalmaster LIMIT 1`;
  db.query(checkColumnQuery, (err, result) => {
    if (result && result.length > 0) {
      return res.status(400).send("Column already exists in verticalmaster table");
    }

    // ALTER TABLE query to add a new column to the verticalmaster table
    const alterTableQuery = `ALTER TABLE verticalmaster ADD COLUMN ${columnname} VARCHAR(255)`;

    db.query(alterTableQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding column to verticalmaster table");
      }

      // INSERT INTO query to add the new vertical to the verticalmaster table
      const insertVerticalQuery = `UPDATE verticalmaster SET ${columnname} = '${verticalname}' WHERE id = 1`;

      db.query(insertVerticalQuery, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error adding new vertical to verticalmaster table");
        }
        return res.status(200).send("Column and vertical added successfully to verticalmaster table");
      });
    });
  });
};


// Productmaster
export const productdata = (req, res) => {
  const q = "SELECT * FROM productmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editProduct = (req, res) => {
  const id = req.params.id;
  const { productininvestments, productinhomeloans, productininsurance} = req.body;
  const q = `UPDATE productmaster SET productininvestments='${productininvestments}', productinhomeloans='${productinhomeloans}', productininsurance='${productininsurance}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


// Approvalmaster
export const approvaldata = (req, res) => {
  const q = "SELECT * FROM approvalmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editapproval = (req, res) => {
  const id = req.params.id;
  const { employeename, employeecode, mobilenumber, password, RegionCode, RegionName, branchname, branchcode } = req.body;
  const q = `UPDATE approvalmaster SET employeename='${employeename}', employeecode='${employeecode}', mobilenumber='${mobilenumber}', password='${password}', RegionCode='${RegionCode}', RegionName='${RegionName}', branchname='${branchname}', branchcode='${branchcode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminapproval = (req, res) => {
  const row = req.body;

  // Insert the row into the usermaster table
  const insertQuery = "INSERT INTO usermaster (`employeename`,`employeecode`,`mobilenumber`,`password`,`RegionCode`,`RegionName`,`branchname`,`branchcode`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [row.employeename, row.employeecode, row.mobilenumber, row.password, row.RegionCode, row.RegionName, row.branchname, row.branchcode];

  db.query(insertQuery, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    // Show a success message
    return res.status(200).json({ message: "User data has been inserted successfully!" });
  });
};
