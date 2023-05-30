import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./Investments.css";
import { AuthContext } from "../../../context/authContext";
import { data } from "../../../constants/data";
import UserInfo from "../../../Components/User/user-info/UserInfo";

const Investments = () => {
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [ivertical, setivertical] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsValid(isInputValid(e.target.value));
  };

  const isInputValid = (value) => {
    // Your validation logic goes here
    // Return true or false based on the validation result
    // For example, check if the input matches the PAN pattern
    const panRegex = /[a-z]{5}[0-9]{4}[a-z]{1}/i;
    return panRegex.test(value);
  };

  useEffect(() => {
    const fetchivertical = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalName"
      );
      setivertical(res.data);
    };
    fetchivertical();
  }, []);

  const [inputs, setInputs] = useState({
    principalName: "",
    productName: "",
    productType: "",
    customerPAN: "",
    customerMobileNumber: "",
    customerName: "",
    creditBranch: "",
    businessAmount: "",
    verticalName: "Investments",
    employeeName: currentUser.employeeName,
    employeeCode: currentUser.employeeCode,
    branchName: currentUser.branchName,
    branchCode: currentUser.branchCode,
    leadRefID: `CL${currentUser.employeeCode}${new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()}${new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '')}`,
  });

  const [iproduct, setiproduct] = useState([]);
  const [iprincipal, setiprincipal] = useState([]);

  useEffect(() => {
    const fetchiproduct = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getproductininvestments"
      );
      setiproduct(res.data);
    };
    fetchiproduct();
  }, []);

  useEffect(() => {
    const fetchiprincipal = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getprincipalininvestments"
      );
      setiprincipal(res.data);
    };
    fetchiprincipal();
  }, []);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uppercasePan = inputs.customerPAN.toUpperCase(); // Convert the PAN number to uppercase
      const response = await axios.post(
        "http://localhost:8800/api/auth/investments",
        { ...inputs, pan: uppercasePan } // Include the uppercase PAN number in the request payload
      );
      setMsg(response.data);
      setErr(null);
    } catch (err) {
      setErr(err.response.data);
      setMsg(null);
    }
  };

  const [selectedProduct, setSelectedProduct] = useState("");
  const [showFreshRenewal, setShowFreshRenewal] = useState(true);
  const [showCreditBranch, setShowCreditBranch] = useState(true);
  const [showPanInput, setShowPanInput] = useState(true);
  const [showCustomerNameInput, setShowCustomerNameInput] = useState(true);
  const [showMobileNumberInput, setShowMobileNumberInput] = useState(true);
  const [showBusinessAmountInput, setShowBusinessAmountInput] = useState(true);
  const [showPrincipalDropdown, setShowPrincipalDropdown] = useState(false);

  const handleProductChange = (event) => {
    const productName = event.target.value;
    setSelectedProduct(productName);
    setShowPrincipalDropdown(event.target.value === "Bonds");

    setInputs((prev) => ({
      ...prev,
      productName: productName,
    }));

    if (productName === "Mutual Funds") {
      setShowPrincipalDropdown(false);
      setShowFreshRenewal(false);
      setShowCreditBranch(false);
      setShowPanInput(true);
      setShowCustomerNameInput(false);
      setShowMobileNumberInput(false);
      setShowBusinessAmountInput(false);
      // add an alert when Mutual Funds is selected
      alert("Entry Only New PAN Cases");
    } else if (
      productName === "Portfolio Management Services" ||
      productName === "Alternative Investment Funds"
    ) {
      setShowPrincipalDropdown(false);
      setShowFreshRenewal(false);
      setShowCreditBranch(false);
      setShowPanInput(true);
      setShowCustomerNameInput(false);
      setShowMobileNumberInput(false);
      setShowBusinessAmountInput(false);
      alert("Entry Only New PAN Cases");
    } else if (productName === "Bonds") {
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
      <p style={{ fontSize: "20px" }}>{ivertical}</p>
      <div className="suser">
        <UserInfo user={data.user} />
      </div>
      <div className="form-container-investments">
        <form className="forminvestments" onSubmit={handleSubmit}>
          <div>
            <label>
              Product<span style={{ color: "red" }}>*</span>
              <select
                required
                className="investmentsinput"
                name="productName"
                value={selectedProduct}
                onChange={handleProductChange}
                onInvalid={(e) => e.target.setCustomValidity("Select Product")}
                onInput={(e) => e.target.setCustomValidity("")}
              >
                <option>Select</option>
                {iproduct
                  .filter((productName) => productName.productName)
                  .map((productName) => (
                    <option
                      key={productName.productName}
                      value={productName.productName}
                    >
                      {productName.productName}
                    </option>
                  ))}
              </select>
            </label>

            {showPrincipalDropdown && (
              <div>
                <label>
                  Principal<span style={{ color: "red" }}>*</span>
                  <select
                    required
                    className="investmentsinput"
                    name="principalName"
                    onChange={handleChange}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Select Principal")
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                  >
                    <option value="">select</option>
                    {iprincipal
                      .filter(
                        (principal) => principal.productName === selectedProduct
                      )
                      .map((principal) =>
                        principal.principals
                          .split(",")
                          .map((singlePrincipal) => (
                            <option
                              key={singlePrincipal}
                              value={singlePrincipal}
                            >
                              {singlePrincipal}
                            </option>
                          ))
                      )}
                  </select>
                </label>
              </div>
            )}

            {showFreshRenewal && (
              <div>
                <label>
                  Fresh / Renewal<span style={{ color: "red" }}>*</span>
                  <select
                    className="investmentsinput"
                    id="purchaseType"
                    name="purchaseType"
                    onChange={handleChange}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Select Fresh / Renewal")
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                  >
                    <option value="">Select</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Renewal">Renewal</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          {showPanInput && (
            <label>
              PAN<span style={{ color: "red" }}>*</span>
              <input
                className="investmentsinput"
                type="text"
                id="customerPAN"
                name="customerPAN"
                maxLength={10}
                pattern="[a-z]{5}[0-9]{4}[a-z]{1}"
                required
                style={{ textTransform: "uppercase" }}
                title="Enter a valid PAN (eg. ABCDE1234F)"
                onChange={handleChange}
              />
            </label>
          )}

          {showCustomerNameInput && (
            <label>
              Customer Name<span style={{ color: "red" }}>*</span>
              <input
                required
                className="investmentsinput"
                type="text"
                id="customerName"
                name="customerName"
                onChange={handleChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity("Customer Name Is Missing ")
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </label>
          )}

          {showMobileNumberInput && (
            <label>
              Mobile Number<span style={{ color: "red" }}>*</span>
              <input
                required
                className="investmentsinput"
                type="test"
                id="customerMobileNumber"
                name="customerMobileNumber"
                pattern="^(?!.*[A-Za-z])[1-9][0-9]*$"
                maxLength={10}
                onChange={handleChange}
                onInvalid={(e) =>
                  e.target.setCustomValidity("Mobile Number Is Missing ")
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </label>
          )}

          {showCreditBranch && (
            <div>
              <label>
                Credit Branch<span style={{ color: "red" }}>*</span>
                <select
                  required
                  className="investmentsinput"
                  id="creditBranch"
                  name="creditBranch"
                  onChange={handleChange}
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Select Credit Branch")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                >
                  <option value="">Select</option>
                  {currentUser.branchName && currentUser.branchCode && (
                    <option
                      value={`${currentUser.branchCode}`}
                    >
                      {currentUser.branchName}-{currentUser.branchCode}
                    </option>
                  )}
                  {currentUser.Branchname2 && currentUser.Branchcode2 && (
                    <option
                      value={`${currentUser.Branchcode2}`}
                    >
                      {currentUser.Branchname2}-{currentUser.Branchcode2}
                    </option>
                  )}
                  {currentUser.Branchname3 && currentUser.Branchcode3 && (
                    <option
                      value={`${currentUser.Branchcode3}`}
                    >
                      {currentUser.Branchname3}-{currentUser.Branchcode3}
                    </option>
                  )}
                  {currentUser.Branchname4 && currentUser.Branchcode4 && (
                    <option
                      value={`${currentUser.Branchcode4}`}
                    >
                      {currentUser.Branchname4}-{currentUser.Branchcode4}
                    </option>
                  )}
                  {currentUser.Branchname5 && currentUser.Branchcode5 && (
                    <option
                      value={`${currentUser.Branchcode5}`}
                    >
                      {currentUser.Branchname5}-{currentUser.Branchcode5}
                    </option>
                  )}
                </select>
              </label>
            </div>
          )}

          {showBusinessAmountInput && (
            <div>
              <label>
                Business Amount<span style={{ color: "red" }}>*</span>
                <input
                  required
                  className="investmentsinput"
                  type="text"
                  pattern="^(?!.*[A-Za-z])[1-9][0-9]*$"
                  id="businessAmount"
                  name="businessAmount"
                  onChange={handleChange}
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Your Business Amount")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </label>
            </div>
          )}

          <div>
            <label>
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="verticalName"
                value="Investments"
                name="verticalName"
              />
            </label>
          </div>

          <div>
            <label>
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="employeeName"
                name="employeeName"
                value={currentUser.employeeName}
              />
            </label>
          </div>

          <div>
            <label>
              {" "}
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="employeeCode"
                name="employeeCode"
                value={currentUser.employeeCode}
              />
            </label>
          </div>

          <div>
            <label>
              {" "}
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="leadRefID"
                name="leadRefID"
                value={`CL${currentUser.employeeCode}${new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()}${new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '')}`}
              />
            </label>
          </div>

          <div>
            <label>
              {" "}
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="branchCode"
                name="branchCode"
                value={currentUser.branchCode}
              />
            </label>
          </div>

          <div>
            <label>
              {" "}
              <input
                required
                className="investmentsinput"
                type="hidden"
                id="branchName"
                name="branchName"
                value={currentUser.branchName}
              />
            </label>
          </div>

          <button type="submit" className="Submitbuttoninvestments">
            Submit
          </button>
        </form>
        {err && err.duplicate && (
          <>
            <div className="popup-background"></div>
            <div className="popup-wrapper">
              <p className="investmsgp">{err.error}</p>
              <div className="investmsg-buttons">
                {/* <button className="investmsg-yes" onClick={handleSubmit}>
                  Yes
                </button> */}
                <a href="/employee/investments">
                  <button className="investmsg-no" onClick={() => setErr(null)}>
                    No
                  </button>
                </a>
              </div>
            </div>
          </>
        )}

        {msg && (
          <>
            <div className="popup-background"></div>
            <div className="popup-wrapper">
              <p className="investmsgp">{msg}</p>
              <a href="/employee/investments">
                <p className="investmsgclose" onClick={() => setMsg(null)}>
                  close
                </p>
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Investments;
