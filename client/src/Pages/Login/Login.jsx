import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./Login.scss";
import "../../App.css";
import way from '../../Assets/sundaram-way.png';
import sd from '../../Assets/sdtransparentlogo.png';
import logo from '../../Assets/sftransparentlogo.png'
import video from '../../Assets/video.mp4';
import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {AiOutlineSwapRight} from 'react-icons/ai';

const Login = () => {
  const [inputs, setInputs] = useState({
    employeecode: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const onSubmit = ()=>{
    setLoginEmployeecode('')
    setLoginPassword('')
  }


  
  return (
    <div className='loginPage flex'>
      {/* <div className="video-bg">
  <video src={video} width="320" height="240" autoPlay loop muted playsInline>
  </video>
</div> */}

    <div className='container flex'>
      
      <div className='videoDiv'>
        <img src={way} />

        <div className='textDiv'>
          <h2 className='title'></h2>
          <p></p>
        </div>

        <div className='footerDiv flex'>
          <span className='text'>Don't have an account?</span>
          <Link to={'/register'}>
            <button className='btn'>Sign Up</button>
          </Link>
        </div>
      </div>

      <div className="formDiv flex">
        <div className="headerDiv">
          <img src={sd} alt="Logo Image" />
          <h3>Welcome!</h3>
        </div>

        <form action="" className='form grid' onSubmit={onSubmit}>
          <div className='inputDiv'>
            <label htmlFor="employeecode">Employee Id</label>
            <div className='input flex'>
              <FaUserShield className='icon' />
              <input type="text" id='employeecode' placeholder='Enter Employee ID' 
              name="employeecode" 
              onChange={handleChange} required />
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="password">Password</label>
            <div className='input flex'>
              <BsFillShieldLockFill className='icon' />
              <input type="password" id='password' placeholder='Enter Password' 
              name="password"
              onChange={handleChange} required/>
            </div>
          </div>
          {err && err}
          <button type='submit' className='btn flex' onClick={handleLogin}>
            <span>Login</span>
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

export default Login;
