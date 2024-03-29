import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./Insurance.css";
import { AuthContext } from "../../../context/authContext";
import { data } from "../../../constants/data";
import UserInfo from "../../../Components/User/user-info/UserInfo";

const Insurance = () => {
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
    principal: "",
    productName: "",
    freshrenewal: "",
    pan: "",
    mobileno: "",
    customername: "",
    creditbranch: "",
    business: "",
    vertical: "Investments",
    employeename: currentUser.employeename,
    employeecode: currentUser.employeecode,
  });

  const [iproduct, setiproduct] = useState([]);

  useEffect(() => {
    const fetchiproduct = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getprincipalininsurance"
      );
      setiproduct(res.data);
    };
    fetchiproduct();
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
      const uppercasePan = inputs.pan.toUpperCase(); // Convert the PAN number to uppercase
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

    const filteredProduct = iproduct.find(
      (product) => product.productName === productName
    );

    if (filteredProduct) {
      setInputs((prev) => ({
        ...prev,
        productName: filteredProduct.productName,
        principal: filteredProduct.principal,
      }));
    }

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
    } else if (productName === "PMS" || productName === "AIF") {
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
                name="product"
                value={selectedProduct}
                onChange={handleProductChange}
                onInvalid={(e) => e.target.setCustomValidity("Select Product")}
                onInput={(e) => e.target.setCustomValidity("")}
              >
                <option>Select</option>
                {iproduct.map((product) => (
                  <option key={product.productName} value={product.productName}>
                    {product.productName}
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
                    name="principal"
                    onChange={handleChange}
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Select Principal")
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                  >
                    <option value="">select</option>
                    {iproduct
                      .filter(
                        (product) => product.productName === selectedProduct
                      )
                      .map((product) =>
                        product.principals.split(",").map((principal) => (
                          <option key={principal} value={principal}>
                            {principal}
                          </option>
                        ))
                      )}
                  </select>
                </label>
              </div>
            )}

          </div>


          <button type="submit" className="Submitbuttoninvestments">
            Submit
          </button>
        </form>
        {err && (
          <>
            <div className="popup-background"></div>
            <div className="popup-wrapper">
              <p className="investmsgp">{err}</p>
              <div className="investmsg-buttons">
                <button className="investmsg-yes" onClick={handleSubmit}>
                  Yes
                </button>
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

export default Insurance;
