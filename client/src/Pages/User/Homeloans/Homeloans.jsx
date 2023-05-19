import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Homeloans.css";
import { data } from '../../../constants/data'
import UserInfo from '../../../Components/User/user-info/UserInfo'

const Homeloans = () => {
  const [hvertical, sethvertical] = useState([]);

  useEffect(() => {
    const fetchhvertical = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalName"
      );
      sethvertical(res.data);
    };
    fetchhvertical();
  }, []);

  return (
    <>
    
      <p style={{ fontSize: "20px" }}>{hvertical}</p>
      <div className='suser'>
        <UserInfo user={data.user} />
      </div>
      <span>Coming Soon</span>
    </>
  );
};

export default Homeloans;
