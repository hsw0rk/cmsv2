import React, { useState, useContext } from "react";
import axios from "axios";
import "./Investments.css";
import { AuthContext } from "../../context/authContext";


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
      setShowCustomerNameInput(false);
      setShowMobileNumberInput(false);
      setShowBusinessAmountInput(false);
      // add an alert when Mutual Funds is selected
      alert("Entry Only New PAN Cases");
    } else if (product === "PMS" || product === "AIF") {
      setShowPrincipalDropdown(false);
      setShowFreshRenewal(false);
      setShowCreditBranch(false);
      setShowPanInput(true);
      setShowCustomerNameInput(false);
      setShowMobileNumberInput(false);
      setShowBusinessAmountInput(false);
      alert("Entry Only New PAN Cases");


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

 <p style={{
  fontSize:"20px"
 }}>Investments</p>
      <div className="form-container-investments">
        
        <form className="forminvestments" onSubmit={handleSubmit}>
          <div>
            <label>
              Product<span style={{ color: 'red' }} >*</span>
              <select required
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
                  Principal<span style={{ color: 'red' }} >*</span>
                  <select required
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
                <label>Fresh / Renewal<span style={{ color: 'red' }} >*</span>
                  <select className="investmentsinput" id="freshrenewal" name="freshrenewal" onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="JM Financial Services">Fresh</option>
                    <option value="Edelweiss Financial Services">Renewal</option>
                  </select>
                </label>
              </div>
            )}

          </div>

          {showPanInput && (
            <label>PAN<span style={{ color: 'red' }} >*</span><input className="investmentsinput" type="text" id="pan" name="pan" maxLength={10}
              pattern="[a-z]{5}[0-9]{4}[a-z]{1}" required style={{ textTransform: 'uppercase' }}
              title="Enter a valid PAN (eg. ABCDE1234F)" onChange={handleChange} /></label>
          )}

          {showCustomerNameInput && (
            <label>Customer Name<span style={{ color: 'red' }} >*</span><input required className="investmentsinput" type="text" id="customername" name="customername" onChange={handleChange} /></label>
          )}

          {showMobileNumberInput && (
            <label>Mobile Number<span style={{ color: 'red' }} >*</span><input required className="investmentsinput" type="number" id="mobileno" name="mobileno" maxLength={10}
              onChange={handleChange} /></label>
          )}

          {showCreditBranch && (
            <div>
              <label>Credit Branch<span style={{ color: 'red' }} >*</span>
                <select required className="investmentsinput" id="creditbranch" name="creditbranch" onChange={handleChange}>
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
              <label>Business Amount<span style={{ color: 'red' }} >*</span><input required className="investmentsinput" type="number" id="business" name="business" onChange={handleChange} /></label>
            </div>
          )}

          <div>
            <label><input  required className="investmentsinput" type="hidden" id="vertical" value="investment"
              name="vertical" /></label>
          </div>

          <div>
            <label><input required className="investmentsinput" type="hidden" id="employeename" name="employeename"
              value={currentUser.employeename} /></label>
          </div>

          <div>
            <label> <input required className="investmentsinput" type="hidden" id="employeecode" name="employeecode"
              value={currentUser.employeecode} /></label>
          </div>

          <button type="submit" className="Submitbuttoninvestments">Submit</button>


          


        </form>
        {err && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{err}</p>
                <div className="investmsg-buttons">
                  <button className="investmsg-yes" onClick={handleSubmit}>Yes</button>
                  <a href="/investments"><button className="investmsg-no" onClick={() => setErr(null)}>No</button></a>
                </div>
              </div>
            </>
          )}


          {msg && (
            <>
              <div className="popup-background"></div>
              <div className="popup-wrapper">
                <p className="investmsgp">{msg}</p>
                <a href="/investments"><p className="investmsgclose" onClick={() => setMsg(null)}>close</p></a>
              </div>
            </>
          )}
      </div>
    </>
  );
};

export default Investments;