// import "./leftBar.scss";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={"/upload/" +currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.employeename}</span>
          </div> 
        </div>
        <hr />
        
        </div>
      </div>
  );
};

export default LeftBar;
