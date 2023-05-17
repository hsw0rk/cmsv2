import React, { useState, useEffect } from "react";
import axios from "axios";
import { data } from '../../../constants/data'
import UserInfo from '../../../Components/User/user-info/UserInfo'

const Leads = () => {
  const [invertical, setinvertical] = useState([]);

  useEffect(() => {
    const fetchinvertical = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalininsurance"
      );
      setinvertical(res.data);
    };
    fetchinvertical();
  }, []);

 
  return (
    <>
    
      <p style={{ fontSize: "20px" }}>LEADS</p>
      <div className='suser'>
        <UserInfo user={data.user} />
      </div>
      <span>Coming Soon</span>
    </>
  );
};

export default Leads;
