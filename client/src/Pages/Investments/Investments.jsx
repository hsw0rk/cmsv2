import React, { useState } from "react";
import axios from "axios";
import "./Investments.css";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Investments = () => {
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    principal: "",
    product: "",
    freshrenewal: "",
    pan: "",
    mobileno: "",
    customername: "",
    creditbranch: "",
    business: "",
    vertical: "",
    employeename: "",
    employeecode: "",
  });

  const [principal, setPrincipal] = useState(""); // Added principal state

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/investments",
        formData
      );
      setMsg(response.data); // set success message here
      setErr(null); // clear error message
    } catch (error) {
      // Check if error message is "Investment already exists!"
      if (error.response.data === "Investment already exists!") {
        const confirmDuplicate = window.confirm(
          "Investment already exists! Do you want to insert duplicate data?"
        );
        if (confirmDuplicate) {
          // User confirmed, update formData and submit duplicate data
          const newFormData = { ...formData };
          try {
            const response = await axios.post(
              "http://localhost:8800/api/auth/investments",
              newFormData
            );
            setMsg(response.data); // set success message here
            setErr(null); // clear error message
          } catch (error) {
            setErr(error.response.data);
            setMsg(null); // clear success message
          }
        } else {
          // User cancelled, do nothing
          setErr("Duplicate data not inserted.");
          setMsg(null); // clear success message
        }
      } else {
        // Error message is not "Investment already exists!", set error message
        setErr(error.response.data);
        setMsg(null); // clear success message
      }
    }
  };

  console.log(err);

  const resetProductFields = (selectedProduct) => {
    if (selectedProduct === "Mutual Funds" || selectedProduct === "Bonds") {
      setFormData({
        ...formData,
        principal: "", // Reset principal value
        freshrenewal: "",
        creditbranch: "",
      });
    }
  };

  return (
    <>
      <div className="in-hl-inu">
        <p className="in-in-hl-inu">Investments</p>
        <p className="p-in-hl-inu">Home Loans</p>
        <p className="p-in-hl-inu">Insurance</p>
      </div>
      <div
        className="error"
        style={{ color: "red", fontSize: "20px", justifyContent:"center", fontWeight: "bold" }}
      >
        {err && err}
      </div>
      <div style={{ color: "green", fontSize: "20px", justifyContent:"center", fontWeight: "bold" }}>
        {msg && msg}
      </div>

      <div className="form-container-investments">
        <form action="" className="forminvestments" onSubmit={handleSubmit}>
          <div class="mb-1">
            <label htmlFor="product">Product</label>
            <select
              className="investmentsinput"
              aria-descendant=""
              name="product"
              value={formData.product}
              onChange={(event) => {
                handleInputChange(event);
                resetProductFields(event.target.value);
              }}
              required
            >
              <option value="">select</option>
              <option value="Deposits">Deposits</option>
              <option value="Mutual Funds">Mutual Funds</option>
              <option value="PMS">PMS</option>
              <option value="AIF">AIF</option>
              <option value="Bonds">Bonds</option>
            </select>
          </div>

          <div
            className="mb-1"
            style={{
              display:
                formData.product === "Mutual Funds" ||
                formData.product === "PMS" ||
                formData.product === "AIF" ||
                formData.product === "Bonds"
                  ? "none"
                  : "block",
            }}
          >
            <label htmlFor="principalSelect">Principal</label>
            <select
              id="principalSelect"
              className="investmentsinput"
              aria-descendant=""
              name="principal"
              disabled={
                formData.principal === "Mutual Funds" ||
                formData.principal === "PMS" ||
                formData.principal === "AIF" ||
                formData.principal === "Bonds"
              }
              onChange={(event) => {
                setFormData({ ...formData, principal: event.target.value });
              }}
              required
            >
              <option value="">select</option>
              <option value="SFL">SFL</option>
              <option value="SHFL">SHFL</option>
              <option value="HDFC">HDFC</option>
              <option value="JM Financial Services">
                JM Financial Services
              </option>
              <option value="Edelweiss Financial Services">
                Edelweiss Financial Services
              </option>
            </select>
          </div>

          <div
            className="mb-1"
            style={{
              display: formData.principal === "Bonds" ? "block" : "none",
            }}
          >
            <label htmlFor="principalBondsSelect">Principal</label>
            <select
              id="principalBondsSelect"
              required
              name="principal"
              className="investmentsinput"
              aria-descendant=""
              disabled={formData.principal !== "Bonds"}
              onChange={(event) => {
                setFormData({ ...formData, principal: event.target.value });
              }}
            >
              <option value="">select</option>
              <option value="JM Financial Services">
                JM Financial Services
              </option>
              <option value="Edelweiss Financial Services">
                Edelweiss Financial Services
              </option>
            </select>
          </div>

          <div
            className="mb-1"
            style={{
              display:
                formData.principal === "Mutual Funds" ||
                formData.principal === "PMS" ||
                formData.principal === "AIF" ||
                formData.principal === "Bonds"
                  ? "none"
                  : "block",
            }}
          >
            <label htmlFor="freshrenewal">Fresh / Renewal</label>
            <select
              required
              name="freshrenewal"
              className="investmentsinput"
              aria-descendant=""
              disabled={
                formData.principal === "Mutual Funds" ||
                formData.principal === "PMS" ||
                formData.principal === "AIF" ||
                formData.principal === "Bonds"
              }
              onChange={(event) => {
                setFormData({ ...formData, freshrenewal: event.target.value });
              }}
            >
              <option value="">select</option>
              <option value="Fresh">Fresh</option>
              <option value="Renewal">Renewal</option>
            </select>
          </div>

          <div className="mb-1">
            <label htmlFor="pan">PAN</label>
            <input
              required
              className="investmentsinput"
              name="pan"
              type="text"
              aria-descendant=""
              maxLength={10}
              pattern="[a-z]{5}[0-9]{4}[a-z]{1}"
              style={{ textTransform: "uppercase" }}
              onChange={(event) => {
                setFormData({
                  ...formData,
                  pan: event.target.value.toUpperCase(),
                });
              }}
              title="Enter a valid PAN (eg: NQUPS6703M)"
            />
          </div>

          <div class="mb-1">
            <label htmlFor="customername">Customername</label>
            <input
              required
              name="customername"
              className="investmentsinput"
              type="text"
              aria-descendant=""
              onChange={(event) => {
                setFormData({ ...formData, customername: event.target.value });
              }}
            />
          </div>

          <div class="mb-1">
            <label htmlFor="mobileno">Mobile Number</label>
            <input
              required
              name="mobileno"
              className="investmentsinput"
              type="text"
              aria-descendant=""
              maxLength={12}
              onChange={(event) => {
                setFormData({ ...formData, mobileno: event.target.value });
              }}
            />
          </div>

          <div
            className="mb-1"
            style={{ display: principal === "Mutual Funds" ? "none" : "block" }}
          >
            <label htmlFor="creditbranch">Credit Branch</label>
            <select
              name="creditbranch"
              className="investmentsinput"
              aria-descendant=""
              disabled={formData.principal === "Mutual Funds"}
              onChange={(event) => {
                setFormData({ ...formData, creditbranch: event.target.value });
              }}
              required
            >
              <option value="select">select</option>
              <option></option>
              <option></option>
            </select>
          </div>

          <div class="mb-1">
            <label htmlFor="business">Business Amount</label>
            <input
              name="business"
              type="text"
              className="investmentsinput"
              aria-descendant=""
              required
              onChange={(event) => {
                setFormData({ ...formData, business: event.target.value });
              }}
            />
          </div>

          <div class="mb-1">
            <input
              name="vertical"
              type="text"
              className="investmentsinput"
              aria-descendant=""
              style={{ display: "none" }}
              value={"investment"}
              onChange={(event) => {
                setFormData({ ...formData, vertical: event.target.value });
              }}
            />
          </div>

          <div class="mb-1">
            <input
              name="employeename"
              type="text"
              className="investmentsinput"
              aria-descendant=""
              style={{ display: "none" }}
              disabled
              value={""}
              onChange={(event) => {
                setFormData({ ...formData, employeename: event.target.value });
              }}
            />
          </div>

          <div class="mb-1">
            <input
              name="employeecode"
              type="text"
              className="investmentsinput"
              aria-descendant=""
              style={{ display: "none" }}
              disabled
              value={""}
              onChange={(event) => {
                setFormData({ ...formData, employeecode: event.target.value });
              }}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Investments;
