import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Homeloans.css";

const Investments = () => {
  const [hvertical, sethvertical] = useState([]);

  useEffect(() => {
    const fetchhvertical = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/auth/getverticalinhomeloans"
      );
      sethvertical(res.data);
    };
    fetchhvertical();
  }, []);

  return (
    <>
    
      <p style={{ fontSize: "20px" }}>{hvertical}</p>
      <span>Coming Soon</span>
    </>
  );
};

export default Investments;
