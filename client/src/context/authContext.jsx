import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      { withCredentials: true, SameSite: "None", Secure: true }
    );
  
    console.log(res.data); // Verify the response data
  
    setCurrentUser(res.data);
  };
  
  
  const logout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", {}, { withCredentials: true });
  
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  };
  
  const isAdmin = () => {
    return currentUser && currentUser.role === "Admin";
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
