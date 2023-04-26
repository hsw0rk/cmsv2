import React, { useState, useContext } from "react";
import axios from "axios";
import "./Investments.css";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const Investments = () => {
  const { currentUser } = useContext(AuthContext);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [inputs, setInputs] = useState({
    principal: "",
    product: "",
    freshrenewal: "",
    pan: "",
    mobileno: "",
    customername: "",
    creditbranch: "",
    business: "",
    vertical: "investments",
    employeename: currentUser.employeename,
    employeecode: currentUser.employeecode,
  });

  

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/investments",
        inputs
      );
      setMsg(response.data);
      setErr(null);
    } catch (err) {
      setErr(err.response.data);
      setMsg(null);
    }
    location.reload();
  };


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8800/api/auth/investments",
  //       formData
  //     );
  //     setMsg(response.data); // set success message here
  //     setErr(null); // clear error message
  //   } catch (error) {
  //     // Check if error message is "Investment already exists!"
  //     if (error.response.data === "Investment already exists!") {
  //       const confirmDuplicate = window.confirm(
  //         "Investment already exists! Do you want to insert duplicate data?"
  //       );
  //       if (confirmDuplicate) {
  //         // User confirmed, update formData and submit duplicate data
  //         const newFormData = { ...formData };
  //         try {
  //           const response = await axios.post(
  //             "http://localhost:8800/api/auth/investments",
  //             newFormData
  //           );
  //           setMsg(response.data); // set success message here
  //           setErr(null); // clear error message
  //         } catch (error) {
  //           setErr(error.response.data);
  //           setMsg(null); // clear success message
  //         }
  //       } else {
  //         // User cancelled, do nothing
  //         setErr("Duplicate data not inserted.");
  //         setMsg(null); // clear success message
  //       }
  //     } else {
  //       // Error message is not "Investment already exists!", set error message
  //       setErr(error.response.data);
  //       setMsg(null); // clear success message
  //     }
  //   }
  // };

  const [selectedProduct, setSelectedProduct] = useState("");
  const [showFreshRenewal, setShowFreshRenewal] = useState(true);
  const [showCreditBranch, setShowCreditBranch] = useState(true);
  const [showPanInput, setShowPanInput] = useState(true);
  const [showCustomerNameInput, setShowCustomerNameInput] = useState(true);
  const [showMobileNumberInput, setShowMobileNumberInput] = useState(true);
  const [showBusinessAmountInput, setShowBusinessAmountInput] = useState(true);
  const [showPrincipalDropdown, setShowPrincipalDropdown] = useState(false);


  const handleProductChange = (event) => {
    const product = event.target.value;
    setSelectedProduct(product);
    setShowPrincipalDropdown(event.target.value === "Bonds");

    setInputs((prev) => ({
      ...prev,
      product: product
    }));

    if (product === "Mutual Funds") {
      setShowPrincipalDropdown(false);
      setShowFreshRenewal(false);
      setShowCreditBranch(false);
      setShowPanInput(true);
      setShowCustomerNameInput(true);
      setShowMobileNumberInput(true);
      setShowBusinessAmountInput(true);

    } else if (product === "PMS" || product === "AIF") {
      setShowPrincipalDropdown(false);
      setShowFreshRenewal(false);
      setShowCreditBranch(true);
      setShowPanInput(true);
      setShowCustomerNameInput(true);
      setShowMobileNumberInput(true);
      setShowBusinessAmountInput(true);

    } else if (product === "Bonds") {
      setShowPrincipalDropdown(true);
      setShowFreshRenewal(false);
      setShowCreditBranch(true);
      setShowPanInput(true);
      setShowCustomerNameInput(true);
      setShowMobileNumberInput(true);
      setShowBusinessAmountInput(true);

    } else {
      setShowPrincipalDropdown(true);
      setShowFreshRenewal(true);
      setShowCreditBranch(true);
      setShowPanInput(true);
      setShowCustomerNameInput(true);
      setShowMobileNumberInput(true);
      setShowBusinessAmountInput(true);
    }
  };


  console.log(err);


  return (
    <>
    <div>
<div className="in-hl-inu">
<p className="in-in-hl-inu">Investments</p>
<p className="p-in-hl-inu">Home Loans</p>
<p className="p-in-hl-inu">Insurance</p>
</div>
<div
className="error"
style={{
  color: "red",
  fontSize: "20px",
  justifyContent: "center",
  fontWeight: "bold",
}}
>
{err && err}
</div>
<div
style={{
  color: "green",
  fontSize: "20px",
  justifyContent: "center",
  fontWeight: "bold",
}}
>
{msg && msg}
</div>
    </div>
  
    <div className="form-container-investments">
    <form className="forminvestments" onSubmit={handleSubmit}>
    <div>
    <label>
        Product
        <select
          className="investmentsinput"
          name="product"
          value={selectedProduct}
          onChange={handleProductChange}
        >
          <option value="">select</option>
          <option value="Deposits">Deposits</option>
          <option value="Mutual Funds">Mutual Funds</option>
          <option value="PMS">PMS</option>
          <option value="AIF">AIF</option>
          <option value="Bonds">Bonds</option>
        </select>
      </label>

      {showPrincipalDropdown && (
        <div>
          <label>
            Principal
            <select
              className="investmentsinput"
              name="principal"
              onChange={handleChange}
            >
              <option value="">select</option>
              {selectedProduct === "Bonds" && (
                <>
                  <option value="JM Financial Services">
                    JM Financial Services
                  </option>
                  <option value="Edelweiss Financial Services">
                    Edelweiss Financial Services
                  </option>
                </>
              )}
              {selectedProduct !== "Bonds" && (
                <>
                  <option value="SFL">SFL</option>
                  <option value="SHFL">SHFL</option>
                  <option value="HDFC">HDFC</option>
                  <option value="JM Financial Services">
                    JM Financial Services
                  </option>
                  <option value="Edelweiss Financial Services">
                    Edelweiss Financial Services
                  </option>
                </>
              )}
            </select>
          </label>
        </div>
      )}

    {showFreshRenewal && (
      <div>
        <label>Fresh / Renewal
          <select className="investmentsinput" id="freshrenewal" name="freshrenewal" onChange={handleChange}>
            <option value="">Select</option>
            <option value="JM Financial Services">Fresh</option>
            <option value="Edelweiss Financial Services">Renewal</option>
          </select>
        </label>
      </div>
    )}

    </div>

    {showPanInput && (
      <label>PAN<input className="investmentsinput" type="text" id="pan" name="pan" maxLength={10}
      pattern="[a-z]{5}[0-9]{4}[a-z]{1}" style={{ textTransform: 'uppercase' }} 
      title="Enter a valid PAN (eg. ABCDE1234F)"onChange={handleChange}/></label>
    )}

    {showCustomerNameInput && (
      <label>Customer Name<input className="investmentsinput" type="text" id="customername" name="customername" onChange={handleChange}/></label>
    )}

    {showMobileNumberInput && (
      <label>Mobile Number<input className="investmentsinput" type="number" id="mobileno" name="mobileno" maxLength={10}
      onChange={handleChange}/></label>
    )}

{showCreditBranch && (
  <div>
    <label>Credit Branch
      <select className="investmentsinput" id="creditbranch" name="creditbranch" onChange={handleChange}>
        <option value="">Select</option>
            {currentUser.Branchname1 && currentUser.Branchcode1 && <option value={`${currentUser.Branchname1}-${currentUser.Branchcode1}`}>{currentUser.Branchname1}-{currentUser.Branchcode1}</option>}
              {currentUser.Branchname2 && currentUser.Branchcode2 && <option value={`${currentUser.Branchname2}-${currentUser.Branchcode2}`}>{currentUser.Branchname2}-{currentUser.Branchcode2}</option>}
              {currentUser.Branchname3 && currentUser.Branchcode3 && <option value={`${currentUser.Branchname3}-${currentUser.Branchcode3}`}>{currentUser.Branchname3}-{currentUser.Branchcode3}</option>}
              {currentUser.Branchname4 && currentUser.Branchcode4 && <option value={`${currentUser.Branchname4}-${currentUser.Branchcode4}`}>{currentUser.Branchname4}-{currentUser.Branchcode4}</option>}
              {currentUser.Branchname5 && currentUser.Branchcode5 && <option value={`${currentUser.Branchname5}-${currentUser.Branchcode5}`}>{currentUser.Branchname5}-{currentUser.Branchcode5}</option>}
      </select>
    </label>
  </div>
)}


    {showBusinessAmountInput && (
    <div>
      <label>Business Amount<input className="investmentsinput" type="number" id="business" name="business" onChange={handleChange}/></label>
    </div>
    )}


    <div>
      <label><input className="investmentsinput" type="hidden" id="vertical"  value="investment"
      name="vertical" /></label>
    </div>





    <div>
      <label><input className="investmentsinput" type="hidden" id="employeename" name="employeename" 
      value={currentUser.employeename}/></label>
    </div>



    <div>
      <label> <input className="investmentsinput" type="hidden" id="employeecode" name="employeecode" 
       value={currentUser.employeecode}/></label>
    </div>


    <button type="submit">Submit</button>
  </form>

  </div>
  </>
  );
};

export default Investments;
