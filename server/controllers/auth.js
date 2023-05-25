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
  const productName = req.body.productName;
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
  const checkDuplicateQuery = "SELECT * FROM cmsverticalform WHERE principal = ? AND productName = ? AND freshrenewal = ? AND pan = ? AND mobileno = ? AND customername = ? AND creditbranch = ? AND business = ? AND vertical = ? AND employeename = ?AND employeecode = ?";
  const values = [principal, productName, freshrenewal, pan, mobileno, customername, creditbranch, business, vertical, employeename, employeecode];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, return an error response
      return res.status(400).json("Data already exists! Do you want to submit?");
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO cmsverticalform (`principal`,`productName`,`freshrenewal`,`pan`,`mobileno`,`customername`,`creditbranch`,`business`,`vertical`,`employeename`,`employeecode`) VALUES (?)";

      const insertValues = [
        principal,
        productName,
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
  const { from, to } = req.query;

  let q = "SELECT * FROM cmsverticalform";

  // Append the date filter to the query if both "from" and "to" dates are provided
  if (from && to) {
    q += ` WHERE DATE(date) >= '${from}' AND DATE(date) <= '${to}'`;
  }

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//dashboard counts
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
  const { regionName, regionCode } = req.body;
  const q = `UPDATE regionmaster SET regionName='${regionName}', regionCode='${regionCode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminregion = (req, res) => {
  const regionName = req.body.regionName;
  const regionCode = req.body.regionCode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM regionmaster WHERE regionName = ? AND regionCode = ?";
  const values = [regionName, regionCode];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE regionmaster SET regionName = ?, regionCode = ? WHERE regionName = ? AND regionCode = ?";
      const updateValues = [regionName, regionCode, regionName, regionCode];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Region data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO regionmaster (`regionName`,`regionCode`) VALUES (?)";

      const insertValues = [
        regionName,
        regionCode
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
  const { regionName, regionCode, branchCode, branchName } = req.body;
  const q = `UPDATE branchmaster SET regionName='${regionName}', regionCode='${regionCode}', branchCode='${branchCode}', branchName='${branchName}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminbranch = (req, res) => {
  const regionName = req.body.regionName;
  const regionCode = req.body.regionCode;
  const branchCode = req.body.branchCode;
  const branchName = req.body.branchName;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
    "SELECT * FROM branchmaster WHERE regionName = ? AND regionCode = ? AND branchCode = ? AND branchName = ?";
  const values = [regionName, regionCode, branchCode, branchName];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
        "UPDATE branchmaster SET regionName = ?, regionCode = ?, branchName = ?, branchCode = ? WHERE regionName = ? AND regionCode = ? AND branchName = ? AND branchCode = ?";
      const updateValues = [
        regionName,
        regionCode,
        branchName,
        branchCode,
        regionName,
        regionCode,
        branchName,
        branchCode,
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Branch data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO branchmaster (`regionName`,`regionCode`,`branchCode`,`branchName`) VALUES (?, ?, ?, ?)";

      const insertValues = [
        regionName,
        regionCode,
        branchCode,
        branchName,
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
  const { employeename, employeecode, mobilenumber, password,regionCode,regionName,branchName,branchCode } = req.body;
  const q = `UPDATE usermaster SET employeename='${employeename}', employeecode='${employeecode}', mobilenumber='${mobilenumber}', password='${password}', regionCode='${regionCode}', regionName='${regionName}', branchName='${branchName}', branchCode='${branchCode}' WHERE id=${id}`;

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
  const regionCode = req.body.regionCode;
  const regionName = req.body.regionName;
  const branchName = req.body.branchName;
  const branchCode = req.body.branchCode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM usermaster WHERE employeename = ? AND employeecode = ? AND mobilenumber = ? AND password = ? AND regionCode = ?AND regionName = ? AND branchName = ?AND branchCode = ?";
  const values = [employeename, employeecode, mobilenumber, password,regionCode,regionName,branchName,branchCode ];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE usermaster SET employeename = ? AND employeecode = ? AND mobilenumber = ? AND password = ? AND regionCode = ?AND regionName = ? AND branchName = ?AND branchCode = ?";
      const updateValues = [employeename, employeecode, mobilenumber, password,regionCode,regionName,branchName,branchCode ,employeename, employeecode, mobilenumber, password,regionCode,regionName,branchName,branchCode];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO Usermaster (`employeename`,`employeecode`,`mobilenumber`,`password`,`regionCode`,`regionName`,`branchName`,`branchCode`) VALUES (?)";

      const insertValues = [
        employeename,
        employeecode,
        mobilenumber,
        password,
        regionCode,
        regionName,
        branchName,
        branchCode
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

//
export const getverticalinbranch = (req, res) => {
  const q = "SELECT * FROM verticalmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getproductininvestments = (req, res) => {
  const q = "SELECT productName FROM productmaster WHERE verticalName = 'Investments'";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getprincipalininsurance = (req, res) => {
  const q = "SELECT productName, GROUP_CONCAT(principal) AS principals FROM principalmaster WHERE verticalName = 'Asset Insurance' GROUP BY productName";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getprincipalininvestments = (req, res) => {
  const q = "SELECT productName, GROUP_CONCAT(principal) AS principals FROM principalmaster WHERE verticalName = 'Investments' GROUP BY productName";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};



export const getverticalName = (req, res) => {
  const q = "SELECT verticalName FROM verticalmaster WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data[0].verticalName);
  });
};

export const getverticalCode = (req, res) => {
  const q = "SELECT verticalCode FROM verticalmaster WHERE id = 1";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data[0].verticalCode);
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
  const { verticalName, verticalCode } = req.body;
  const q = `UPDATE verticalmaster SET verticalName='${verticalName}', verticalCode='${verticalCode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminvertical = (req, res) => {
    const verticalName = req.body.verticalName;
    const verticalCode = req.body.verticalCode;
  
    // Check if the data already exists in the database based on multiple fields
    const checkDuplicateQuery = "SELECT * FROM verticalmaster WHERE verticalName = ? AND verticalCode = ?";
    const values = [verticalName, verticalCode];
  
    db.query(checkDuplicateQuery, values, (err, results) => {
      if (err) return res.status(500).json(err);
  
      if (results.length > 0) {
        // If the data already exists, update the existing row
        const updateQuery = "UPDATE verticalmaster SET verticalName = ?, verticalCode = ? WHERE verticalName = ? AND verticalCode = ?";
        const updateValues = [verticalName, verticalCode, verticalName, verticalCode];
  
        db.query(updateQuery, updateValues, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Vertical data has been updated!");
        });
      } else {
        // If the data does not exist, insert the data into the database
        const insertQuery = "INSERT INTO verticalmaster (`verticalName`,`verticalCode`) VALUES (?)";
  
        const insertValues = [
          verticalName,
          verticalCode
        ];
  
        db.query(insertQuery, [insertValues], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Vertical data has been created!");
        });
      }
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
  const { verticalName, verticalCode, productName, productCode} = req.body;
  const q = `UPDATE productmaster SET verticalName='${verticalName}', verticalCode='${verticalCode}', productName='${productName}', productCode='${productCode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminproduct = (req, res) => {
  const verticalName = req.body.verticalName;
  const verticalCode = req.body.verticalCode;
  const productName = req.body.productName;
  const productCode = req.body.productCode;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
    "SELECT * FROM productmaster WHERE verticalName = ? AND verticalCode = ? AND productName = ? AND productCode = ?";
  const values = [verticalName, verticalCode, productName, productCode];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
        "UPDATE productmaster SET verticalName = ?, verticalCode = ?, productName = ?, productCode = ? WHERE verticalName = ? AND verticalCode = ? AND productName = ? AND productCode = ?";
      const updateValues = [
        verticalName,
        verticalCode,
        productName,
        productCode,
        verticalName,
        verticalCode,
        productName,
        productCode,
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Product data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO productmaster (`verticalName`,`verticalCode`,`productName`,`productCode`) VALUES (?, ?, ?, ?)";

      const insertValues = [
        verticalName,
        verticalCode,
        productName,
        productCode,
      ];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Product data has been created!");
      });
    }
  });
};

//Principalmaster
export const principaldata = (req, res) => {
  const q = "SELECT * FROM principalmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editprincipal = (req, res) => {
  const id = req.params.id;
  const { verticalName, productName, principal } = req.body;
  const q = `UPDATE principalmaster SET verticalName='${verticalName}', productName='${productName}', principal='${principal}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminprincipal = (req, res) => {
  const verticalName = req.body.verticalName;
  const productName = req.body.productName;
  const principal = req.body.principal;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM principalmaster WHERE verticalName = ? AND productName = ? AND principal = ?";
  const values = [verticalName, productName, principal ];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE principalmaster SET verticalName = ? AND productName = ? AND principal = ?";
      const updateValues = [verticalName, productName, principal];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Principal data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO principalmaster (`verticalName`,`productName`,`principal`) VALUES (?)";

      const insertValues = [
        verticalName,
        productName,
        principal,
      ];

      db.query(insertQuery, [insertValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Principal data has been created!");
      });
    }
  });
};


export const getverticalinprincipal = (req, res) => {
  const q = "SELECT * FROM verticalmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getproductinprincipal = (req, res) => {
  const q = "SELECT * FROM productmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
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
  const { employeename, employeecode, mobilenumber, password, regionCode, regionName, branchName, branchCode } = req.body;
  const q = `UPDATE approvalmaster SET employeename='${employeename}', employeecode='${employeecode}', mobilenumber='${mobilenumber}', password='${password}', regionCode='${regionCode}', regionName='${regionName}', branchName='${branchName}', branchCode='${branchCode}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminapproval = (req, res) => {
  const row = req.body;

  // Insert the row into the usermaster table
  const insertQuery = "INSERT INTO usermaster (`employeename`,`employeecode`,`mobilenumber`,`password`,`regionCode`,`regionName`,`branchName`,`branchCode`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [row.employeename, row.employeecode, row.mobilenumber, row.password, row.regionCode, row.regionName, row.branchName, row.branchCode];

  db.query(insertQuery, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    // Show a success message
    return res.status(200).json({ message: "User data has been inserted successfully!" });
  });
};


//businessheadmaster
export const businessheaddata = (req, res) => {
  const q = "SELECT * FROM  businessheadmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editbusinesshead = (req, res) => {
  const id = req.params.id;
  const { businessHeadCode, businessHeadName, verticalCode , verticalName } = req.body;
  const q = `UPDATE  businessheadmaster SET businessHeadCode='${businessHeadCode}', businessHeadName='${businessHeadName}', verticalCode='${verticalCode}', verticalName='${verticalName}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminbusinesshead = (req, res) => {
  const businessHeadCode = req.body.businessHeadCode;
  const businessHeadName = req.body.businessHeadName;
  const verticalCode = req.body.verticalCode;
  const verticalName = req.body.verticalName;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
    "SELECT * FROM businessheadmaster WHERE businessHeadCode = ? AND businessHeadName = ? AND verticalCode = ? AND verticalName = ?";
  const values = [businessHeadCode, businessHeadName, verticalCode, verticalName];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
        "UPDATE businessheadmaster SET businessHeadCode = ?, businessHeadName = ?, verticalCode = ?, verticalName = ? WHERE businessHeadCode = ? AND businessHeadName = ? AND verticalCode = ? AND verticalName = ?";
      const updateValues = [
        businessHeadCode,
        businessHeadName,
        verticalCode,
        verticalName,
        businessHeadCode,
        businessHeadName,
        verticalCode,
        verticalName,
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Business Head data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO businessheadmaster (`businessHeadCode`,`businessHeadName`,`verticalCode`,`verticalName`) VALUES (?, ?, ?, ?)";

      const insertValues = [
        businessHeadCode,
        businessHeadName,
        verticalCode,
        verticalName,
      ];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Business Head data has been created!");
      });
    }
  });
};


export const getverticalinbusinesshead = (req, res) => {
  const q = "SELECT * FROM verticalmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};


//regionheadmaster
export const regionheaddata = (req, res) => {
  const q = "SELECT * FROM  regionheadmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editregionhead = (req, res) => {
  const id = req.params.id;
  const { regionHeadCode, regionHeadName, regionCode , regionName } = req.body;
  const q = `UPDATE  regionheadmaster SET regionHeadCode='${regionHeadCode}', regionHeadName='${regionHeadName}', regionCode='${regionCode}', regionName='${regionName}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminregionhead = (req, res) => {
  const regionHeadCode = req.body.regionHeadCode;
  const regionHeadName = req.body.regionHeadName;
  const regionCode = req.body.regionCode;
  const regionName = req.body.regionName;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
    "SELECT * FROM regionheadmaster WHERE regionHeadCode = ? AND regionHeadName = ? AND regionCode = ? AND regionName = ?";
  const values = [regionHeadCode, regionHeadName, regionCode, regionName];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
        "UPDATE regionheadmaster SET regionHeadCode = ?, regionHeadName = ?, regionCode = ?, regionName = ? WHERE regionHeadCode = ? AND regionHeadName = ? AND regionCode = ? AND regionName = ?";
      const updateValues = [
        regionHeadCode,
        regionHeadName,
        regionCode,
        regionName,
        regionHeadCode,
        regionHeadName,
        regionCode,
        regionName,
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Region Head data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO regionheadmaster (`regionHeadCode`,`regionHeadName`,`regionCode`,`regionName`) VALUES (?, ?, ?, ?)";

      const insertValues = [
        regionHeadCode,
        regionHeadName,
        regionCode,
        regionName,
      ];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Region Head data has been created!");
      });
    }
  });
};


//verticalheadmaster
export const verticalheaddata = (req, res) => {
  const q = "SELECT * FROM  verticalheadmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editverticalhead = (req, res) => {
  const id = req.params.id;
  const { verticalHeadCode, verticalHeadName, verticalCode, verticalName, businessHeadCode, businessHeadName, regionCode, regionName, regionHeadCode, regionHeadName } = req.body;
  const q = `UPDATE  verticalheadmaster SET verticalHeadCode='${verticalHeadCode}', verticalHeadName='${verticalHeadName}', verticalCode='${verticalCode}', verticalName='${verticalName}', businessHeadCode='${businessHeadCode}', businessHeadName='${businessHeadName}', regionCode='${regionCode}', regionName='${regionName}', regionHeadCode='${regionHeadCode}', regionHeadName='${regionHeadName}' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminverticalhead = (req, res) => {
  const verticalHeadCode = req.body.verticalHeadCode;
  const verticalHeadName = req.body.verticalHeadName;
  const verticalCode = req.body.verticalCode;
  const verticalName = req.body.verticalName;
  const businessHeadCode = req.body.businessHeadCode;
  const businessHeadName = req.body.businessHeadName;
  const regionCode = req.body.regionCode;
  const regionName = req.body.regionName;
  const regionHeadCode = req.body.regionHeadCode;
  const regionHeadName = req.body.regionHeadName;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery =
  "SELECT * FROM verticalheadmaster WHERE verticalHeadCode = ? AND verticalHeadName = ? AND verticalCode = ? AND verticalName = ? AND businessHeadCode = ? AND businessHeadName = ? AND regionCode = ? AND regionName = ? AND regionHeadCode = ? AND regionHeadName = ?";
  const values = [verticalHeadCode, verticalHeadName, verticalCode, verticalName, businessHeadCode, businessHeadName, regionCode, regionName, regionHeadCode, regionHeadName];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery =
      "UPDATE verticalheadmaster SET verticalHeadCode = ?, verticalHeadName = ?, verticalCode = ?, verticalName = ?, businessHeadCode = ?, businessHeadName = ?, regionCode = ?, regionName = ?, regionHeadCode = ?, regionHeadName = ? WHERE verticalHeadCode = ? AND verticalHeadName = ? AND verticalCode = ? AND verticalName = ? AND businessHeadCode = ? AND businessHeadName = ? AND regionCode = ? AND regionName = ? AND regionHeadCode = ? AND regionHeadName = ?";
      const updateValues = [
        verticalHeadCode,
        verticalHeadName,
        verticalCode,
        verticalName,
        businessHeadCode,
        businessHeadName,
        regionCode,
        regionName,
        regionHeadCode,
        regionHeadName
      ];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Vertical Head data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery =
        "INSERT INTO verticalheadmaster (`verticalHeadCode`,`verticalHeadName`,`verticalCode`,`verticalName`,`businessHeadCode`,`businessHeadName`,`regionCode`,`regionName`,`regionHeadCode`,`regionHeadName`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const insertValues = [
        verticalHeadCode,
        verticalHeadName,
        verticalCode,
        verticalName,
        businessHeadCode,
        businessHeadName,
        regionCode,
        regionName,
        regionHeadCode,
        regionHeadName
      ];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Vertical Head data has been created!");
      });
    }
  });
};

export const getverticalinverticalhead = (req, res) => {
  const q = "SELECT * FROM verticalmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};


export const getbusinessinverticalhead = (req, res) => {
  const q = "SELECT * FROM businessheadmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getregioninverticalhead = (req, res) => {
  const q = "SELECT * FROM regionmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

export const getregionheadinverticalhead = (req, res) => {
  const q = "SELECT * FROM regionheadmaster";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json("Internal server error");
    return res.status(200).json(data);
  });
};

//comaster
export const coheaddata = (req, res) => {
  const q = "SELECT * FROM   coheadmaster";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const editcoheadmaster = (req, res) => {
  const id = req.params.id;
  const { coHeadCode,  coHeadName } = req.body;
  const q = `UPDATE   coheadmaster SET coHeadCode='${coHeadCode}',  coHeadName  ='${  coHeadName  }' WHERE id=${id}`;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const adminco = (req, res) => {
  const coHeadCode = req.body.coHeadCode;
  const coHeadName = req.body.coHeadName;

  // Check if the data already exists in the database based on multiple fields
  const checkDuplicateQuery = "SELECT * FROM coheadmaster WHERE coHeadCode = ? AND coHeadName = ?";
  const values = [coHeadCode, coHeadName];

  db.query(checkDuplicateQuery, values, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // If the data already exists, update the existing row
      const updateQuery = "UPDATE coheadmaster SET coHeadCode = ?, coHeadName = ? WHERE coHeadCode = ? AND coHeadName = ?";
      const updateValues = [coHeadCode, coHeadName, coHeadCode, coHeadName];

      db.query(updateQuery, updateValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("CO Head data has been updated!");
      });
    } else {
      // If the data does not exist, insert the data into the database
      const insertQuery = "INSERT INTO coheadmaster (`coHeadCode`, `coHeadName`) VALUES (?, ?)";
      const insertValues = [coHeadCode, coHeadName];

      db.query(insertQuery, insertValues, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("CO Head data has been created!");
      });
    }
  });
};


