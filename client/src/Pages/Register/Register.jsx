import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import "../../App.css";
import axios from "axios";
import logo from '../../Assets/sftransparentlogo.png'
import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {AiOutlineSwapRight} from 'react-icons/ai';
import {MdMarkEmailRead} from 'react-icons/md';

const Register = () => {
  const [inputs, setInputs] = useState({
    employeecode: "",
    employeename: "",
    mobilenumber: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

  return (
    <div className='registerPage flex'>
    <div className='container flex'>
      
      <div className='videoDiv'>
        {/* <video src={video} autoPlay muted loop></video> */}

        <div className='textDiv'>
          <h2 className='title'>SD Employee Site</h2>
          <p>Sundaram Finance</p>
        </div>

        <div className='footerDiv flex'>
          <span className='text'>Have an account?</span>
          <Link to={'/login'}>
            <button className='btn'>Login</button>
          </Link>
        </div>
      </div>

      <div className="formDiv flex">
        <div className="headerDiv">
          <img src={logo} alt="Logo Image" />
          <h3>Welcome!</h3>
        </div>

        <form action="" className='form grid'>
         
         <div className='inputDiv'>
            <label htmlFor="employeecode">Employee Code</label>
            <div className='input flex'>
              <MdMarkEmailRead className='icon' />
              <input type="number" id='employeecode' placeholder='Enter Employee code' 
              name="employeecode"
              onChange={handleChange}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="employeename">Employee Name</label>
            <div className='input flex'>
              <FaUserShield className='icon' />
              <input type="text" id='employeename' placeholder='Enter Employee name'
              name="employeename" 
              onChange={handleChange}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="mobilenumber">Mobile Number</label>
            <div className='input flex'>
              <FaUserShield className='icon' />
              <input type="text" id='mobilenumber' placeholder='Enter Mobile Number'
              onChange={handleChange}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="password">Password</label>
            <div className='input flex'>
              <BsFillShieldLockFill className='icon' />
              <input type="password" id='password' placeholder='Enter Password' 
              name="password"
              onChange={handleChange}/>
            </div>
          </div>

          <button type='submit' className='btn flex' onClick={handleClick}>
            <span>Register</span>
            <AiOutlineSwapRight className='icon' />
          </button>

          <span className='forgotPassword'>
            Forgot your password? <a href="">Click Here</a>
          </span>
        </form>
      </div>

    </div>    
    </div>
  );
};

export default Register;
