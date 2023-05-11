import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Insurance.css";


const Investments = () => {
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
    
      <p style={{ fontSize: "20px" }}>{invertical}</p>
      <span>Coming Soon</span>
    </>
  );
};

export default Investments;
