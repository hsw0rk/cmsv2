import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.scss";
import "../../App.css";
import axios from "axios";
import logo from "../../Assets/sftransparentlogo.png";
import way from '../../Assets/sundaram-way.png';
import video from '../../Assets/video.mp4';
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead } from "react-icons/md";
import { CiMobile2 } from "react-icons/ci";


const Register = () => {
  const [inputs, setInputs] = useState({
    employeecode: "",
    employeename: "",
    mobilenumber: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs
      );
      setMsg(response.data); // set success message here
      setErr(null); // clear error message
    } catch (err) {
      setErr(err.response.data);
      setMsg(null); // clear success message
    }
  };

  console.log(err);

  return (
    <div className="registerPage flex">
           <div className="video-bg">
  <video src={video} width="320" height="240" autoPlay loop muted playsInline>
  </video>
</div>
      <div className="container flex">
        <div className="videoDiv">
          <img src={way}></img>

          <div className="textDiv">
            <h2 className="title"></h2>
            <p></p>
          </div>
          <div
            className="error"
            style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}
          >
            {err && err}
          </div>
          <div style={{ color: "green", fontSize: "20px", fontWeight: "bold" }}>
            {msg && msg}
          </div>

          <div className="footerDiv flex">
            <span className="text">Have an account?</span>
            <Link to={"/login"}>
              <button className="btn">Login</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo Image" />
            <h3>Welcome!</h3>
          </div>

          <form action="" className="form grid">
            <div className="inputDiv">
              <label htmlFor="employeecode">Employee Code</label>
              <div className="input flex">
                <MdMarkEmailRead className="icon" />
                <input
                  type="number"
                  id="employeecode"
                  placeholder="Enter Employee code"
                  name="employeecode"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="employeename">Employee Name</label>
              <div className="input flex">
                <FaUserShield className="icon" />
                <input
                  type="text"
                  id="employeename"
                  placeholder="Enter Employee name"
                  name="employeename"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="mobilenumber">Mobile Number</label>
              <div className="input flex">
                <CiMobile2 className="icon" />
                
                <input
                  type="text"
                  id="mobilenumber"
                  placeholder="Enter Mobile Number"
                  name="mobilenumber"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn flex" onClick={handleClick}>
              <span>Register</span>
              <AiOutlineSwapRight className="icon" />
            </button>

            <span className="forgotPassword">
              Forgot your password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
