import axios from "axios";
import { createContext, useEffect, useState } from "react";
import './authContext.css';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false); // Track session expiration status

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      { withCredentials: true, SameSite: "None", Secure: true }
    );

    setCurrentUser(res.data);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setCurrentUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === "Admin";
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/auth/currentuser",
          { withCredentials: true }
        );
        setCurrentUser(res.data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();

    // Add event listeners for user activity detection
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    // Set up periodic heartbeat requests
    const heartbeatInterval = setInterval(sendHeartbeat, 60000); // Send a heartbeat request every minute

    // Clean up event listeners and heartbeat interval on component unmount
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      clearInterval(heartbeatInterval);
    };
  }, []);

  const handleUserActivity = () => {
    // Make an AJAX request to update the session's last activity timestamp
    axios.post("http://localhost:8800/api/auth/activity", null, {
      withCredentials: true,
    });
  
    // Reset the session expiration timeout
    clearTimeout(sessionTimeoutRef.current);
    sessionTimeoutRef.current = setTimeout(() => {
      setSessionExpired(true);
    }, 60000);
  };
  

  const sendHeartbeat = () => {
    // Make a heartbeat AJAX request to update the session's last activity timestamp
    axios.post("http://localhost:8800/api/auth/heartbeat", null, {
      withCredentials: true,
    });
  };

  useEffect(() => {
    const sessionTimeoutRef = setTimeout(() => {
      setSessionExpired(true);
    }, 60000);
  
    return () => {
      clearTimeout(sessionTimeoutRef);
    };
  }, []);
  

  const handleSessionExpired = async () => {
    setSessionExpired(false);
    const res = await axios.get("http://localhost:8800/api/auth/currentuser", {
      withCredentials: true,
    });
  
    if (res.status === 200) {
      // User is still logged in, proceed with logout
      await logout(); // Wait for the logout request to complete
    }
  
    window.location.href = "/login"; // Redirect to the login page
  };
  

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isAdmin, sessionExpired, handleSessionExpired }}
    >
      {children}
      {sessionExpired && (
        // Display the session expired message with backdrop when sessionExpired is true
        <div className="session-expired-message-container">
          <div className="session-expired-message">
            Session expired. Please login again.
            <button className="session-button" onClick={handleSessionExpired}>OK</button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
