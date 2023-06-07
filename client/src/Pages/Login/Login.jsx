import "./Login.scss";
import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import logo from "../../Assets/sdtransparentlogo.png";
import { Toast } from 'primereact/toast';

function LoginRegister() {
  const [option, setOption] = React.useState(1);
  const [inputs, setInputs] = useState({
    employeeCode: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const toast = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login, isAdmin } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data,
        life: 3000,
      });
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs
      );
      // setMsg(response.data); // set success message here
      setErr(null); // clear error message
      toast.current.show({ severity: 'success', summary: 'Success', detail: response.data, life: 3000 });
    } catch (err) {
      // setErr(err.response.data);
      setMsg(null); // clear success message
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data, life: 3000 });
    }
    setTimeout(() => {
        window.location.href = "/login"; // redirect
      }, 2000); // navigate to "/" after 2 seconds
  };
  

  return (
    <div className="loginregister">
        
    <div className="container">
    <div>
            <img src={logo} 
            style={{width:"10rem",height:"2rem",marginBottom:"5px", justifyContent:"center"}}/>
        </div>
      <header>
        <div
          className={
            "header-headings " +
            (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
          }
        >
          <span>Sign in to your account</span>
          <span>Create an account</span>
          <span>Reset your password</span>
        </div>
      </header>
      <ul className="options">
        <li
          className={option === 1 ? "active" : ""}
          onClick={() => setOption(1)}
        >
          Sign in
        </li>
        <li
          className={option === 2 ? "active" : ""}
          onClick={() => setOption(2)}
        >
          Sign up
        </li>
        <li
          className={option === 3 ? "active" : ""}
          onClick={() => setOption(3)}
        >
          Forgot Password?
        </li>
      </ul>
      <form className="account-form">
  <div
    className={
      "account-form-fields " +
      (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
    }
  >
    {option !== 3 && (
      <>
        {/* <label htmlFor="employeeCode">Employee Code:</label> */}
        <input
          id="employeeCode"
          name="employeeCode"
          type="text"
          placeholder="Employee Code"
          required
          onChange={handleChange}
          autoComplete="username" 
        />
      </>
    )}
    {option === 3 && (
      <>
        {/* <label htmlFor="mobilenumber">Mobile Number:</label> */}
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="number"
          placeholder="Mobile Number"
          required
          onChange={handleChange}
        />
      </>
    )}
    {/* <label htmlFor="password">Password:</label> */}
    <input
      id="password"
      name="password"
      type="password"
      placeholder="Password"
      required={option === 1 || option === 2 ? true : false}
      disabled={option === 3 ? true : false}
      onChange={handleChange}
      autoComplete="current-password" 
    />
    {option === 2 && (
      <>
        {/* <label htmlFor="employeename">Employee Name:</label> */}
        <input
          id="employeeName"
          name="employeeName"
          type="text"
          placeholder="Employee Name"
          required={option === 2 ? true : false}
          disabled={option === 1 || option === 3 ? true : false}
          onChange={handleChange}
        />
        {/* <label htmlFor="mobilenumber">Mobile Number:</label> */}
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="number"
          placeholder="Mobile Number"
          required={option === 2 ? true : false}
          disabled={option === 1 || option === 3 ? true : false}
          onChange={handleChange}
        />
      </>
    )}
  </div>
  <Toast ref={toast} />
        {err && <div className="error-message">{err}</div>}
        {msg && <div className="success-message">{msg}</div>}
        <button
          className="btn-submit-form"
          type="submit"
          onClick={option === 2 ? handleRegister : handleLogin}
        >
          {option === 1
            ? "Sign in"
            : option === 2
            ? "Sign up"
            : "Reset password"}
        </button>
      </form>
    </div>
    </div>
  );
}

export default LoginRegister;