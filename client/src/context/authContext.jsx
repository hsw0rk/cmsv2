import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
      SameSite: 'None',
      Secure: true
    });
  
    setCurrentUser(res.data)
  };

  const logout = async (inputs) => {
    await axios.post("http://localhost:8800/api/auth/logout");
    setCurrentUser(null);
  };

  const isAdmin = () => {
    return currentUser && currentUser.employeeCode === "Admin1";
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};