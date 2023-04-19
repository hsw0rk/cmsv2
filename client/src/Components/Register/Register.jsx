import React, {useState} from 'react'
import './Register.css'
import 'D:/Harish/Projects/Office/cms/client/src/App.css'
import { Link, useNavigate } from 'react-router-dom';
import video from 'D:/Harish/Projects/Office/cms/client/src/LoginAssets/leafvideo.mp4';
import logo from 'D:/Harish/Projects/Office/cms/client/src/LoginAssets/sftransparentlogo.png';
import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {AiOutlineSwapRight} from 'react-icons/ai';
import {MdMarkEmailRead} from 'react-icons/md';
import Axios from 'axios';

const Register = () => {
  // UseState to hold our inputs
  const [employeecode, setEmployeecode] = useState('');
  const [employeename, setEmployeename] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo = useNavigate()

  // Onclick get what user has entered
  const createUser = (e)=>{
    e.preventDefault();
    // Using Axios to create an API that connects to the server
    Axios.post('http://localhost:3002/register',{
      // Creating variable to send to server through the route
      Employeecode: employeecode,
      Employeename: employeename,
      Password: password
    }).then(()=>{
      navigateTo('/')

      // clear the fields
      setEmployeecode('')
      setEmployeename('')
      setPassword('')
    })
  }

  return (
    <div className='registerPage flex'>
    <div className='container flex'>
      
      <div className='videoDiv'>
        {/* <video src={video} autoPlay muted loop></video> */}

        <div className='textDiv'>
          <h2 className='title'>CMS</h2>
          <p>Sundaram Direct</p>
        </div>

        <div className='footerDiv flex'>
          <span className='text'>Have an account?</span>
          <Link to={'/'}>
            <button className='btn'>Login</button>
          </Link>
        </div>
      </div>

      <div className="formDiv flex">
        <div className="headerDiv">
          <img src={logo} alt="Logo Image" />
          <h3>Let Us Know You!</h3>
        </div>

        <form action="" className='form grid'>
         
         <div className='inputDiv'>
            <label htmlFor="email">Employee Code</label>
            <div className='input flex'>
              <MdMarkEmailRead className='icon' />
              <input type="number" id='number' placeholder='Enter Employee code' 
              onChange={(event)=>{
                setEmployeecode(event.target.value)
              }}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="username">Employee Name</label>
            <div className='input flex'>
              <FaUserShield className='icon' />
              <input type="text" id='username' placeholder='Enter Employee name' 
              onChange={(event)=>{
                setEmployeename(event.target.value)
              }}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="password">Password</label>
            <div className='input flex'>
              <BsFillShieldLockFill className='icon' />
              <input type="password" id='password' placeholder='Enter Password' 
              onChange={(event)=>{
                setPassword(event.target.value)
              }}/>
            </div>
          </div>

          <button type='submit' className='btn flex' onClick={createUser}>
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
  )
}

export default Register