// import "./navbar.scss";
import { Link } from "react-router-dom";
import React,{ useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../Assets/sdtransparentlogo.png";
import './Navbar.css';


// Navbar (Header)
const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <header className='header'>
      <Link to={'/'}><img src={logo} alt="Company Logo" className='header-logo' /></Link>
      <span className="empname">Welcome {currentUser.employeename}!</span>
            <div className="buttons">
                <button onClick="" className="button is-light">
                  Log out
                </button>
              </div>
      </header>
    </div>
  );
};

export default Navbar;