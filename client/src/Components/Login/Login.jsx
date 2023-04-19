import React, {useState, useEffect} from 'react'
import './Login.css'
import 'D:/Harish/Projects/Office/loginregister/client/src/App.css'
import { Link, useNavigate } from 'react-router-dom';
import video from 'D:/Harish/Projects/Office/loginregister/client/src/LoginAssets/leafvideo.mp4';
import logo from 'D:/Harish/Projects/Office/loginregister/client/src/LoginAssets/leaflogo.png';
import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {AiOutlineSwapRight} from 'react-icons/ai';
import Axios from 'axios';


const Login = () => {
  // UseState Hook to store inputs
  const [loginUserName, setLoginUserName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const navigateTo = useNavigate()

  // show message to the user
  const [loginStatus, setLoginStatus] = useState('')
  const [statusHolder, setstatusHolder] = useState('message')

   // Onclick get what user has entered
   const loginUser = (e)=>{

    e.preventDefault();

    // Using Axios to create an API that connects to the server
    Axios.post('http://localhost:3002/login',{
      // Creating variable to send to server through the route
      LoginUserName: loginUserName,
      LoginPassword: loginPassword
    }).then((response)=>{
      console.log()
      if(response.data.message || loginUserName == '' || loginPassword == ''){
        // if credentials dont match
        navigateTo('/')
        setLoginStatus(`Credentials don't exist!`)
      }
      else{
        navigateTo('/dashboard' , { state: { username: response.data[0].username, email: response.data[0].email } }) // if match
      }
    })
  }

  useEffect(()=>{
    if(loginStatus !== ''){
      setstatusHolder('showMessage') // show message
      setTimeout(() => {
        setstatusHolder('message') // hide it after 4s
      }, 4000);
    }
  }, [loginStatus])

  // clear form on submit
  const onSubmit = ()=>{
    setLoginUserName('')
    setLoginPassword('')
  }

  return (
    <div className='loginPage flex'>
    <div className='container flex'>
      
      <div className='videoDiv'>
        <video src={video} autoPlay muted loop></video>

        <div className='textDiv'>
          <h2 className='title'>Create and sell extraordinary products</h2>
          <p>Adopt the peace of nature!</p>
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
          <img src={logo} alt="Logo Image" />
          <h3>Welcome Back</h3>
        </div>

        <form action="" className='form grid' onSubmit={onSubmit}>
          <span className={statusHolder}>{loginStatus}</span>
          <div className='inputDiv'>
            <label htmlFor="username">Username</label>
            <div className='input flex'>
              <FaUserShield className='icon' />
              <input type="text" id='username' placeholder='Enter Username' 
              onChange={(event)=>{
                setLoginUserName(event.target.value)
              }}/>
            </div>
          </div>

          <div className='inputDiv'>
            <label htmlFor="password">Password</label>
            <div className='input flex'>
              <BsFillShieldLockFill className='icon' />
              <input type="password" id='password' placeholder='Enter Password' 
              onChange={(event)=>{
                setLoginPassword(event.target.value)
              }}/>
            </div>
          </div>

          <button type='submit' className='btn flex' onClick={loginUser}>
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
  )
}

export default Login