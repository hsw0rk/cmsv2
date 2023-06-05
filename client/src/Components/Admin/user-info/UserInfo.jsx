import React,{ useContext, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './user-info.scss'
import { AuthContext } from "../../../context/authContext";
import axios from "axios";


const UserInfo = ({ user }) => {
    const { currentUser, logout  } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    };    
  

    return (
        <div className='user-info'>
            <div className="user-info__img">
            <Link to="/profile"><img src={user.img} alt="profile" title="profile" /></Link>
            </div>
            <div className="user-info__name">
                <span>{currentUser.employeeName.split(" ")[0]}</span>
            </div>
            <div className="user-info__menu" >
                <div className="user-info__menu__icon">
                <i className='bx bx-log-out logout' title="logout" onClick={handleLogout}></i>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;