// import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const logout = (navigate) => {
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  navigate('/login');
};

const RightBar = () => {

  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <p>Welcome, {currentUser.employeename}</p>
          </div>
        </div>
        <hr />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default RightBar;
