import React, {useContext} from 'react'
import './overall-list.scss'
import { AuthContext } from "../../../context/authContext";

const icons = [
    <i className='bx bx-user'></i>,
    <i className='bx bx-receipt'></i>,
    <i className='bx bx-current-location'></i>,
    <i className='bx bx-map-pin'></i>,
    <i className='bx bxl-gmail'></i>
]

const overall = (currentUser) => [
    {
        value: currentUser.employeecode,
        title: "Employee Code",
      },
    {
      value: currentUser.regioncode,
      title: "Region Code",
    },
    {
      value: currentUser.regionname,
      title: "Region Name",
    },
    {
      value: currentUser.employeeDesignation,
      title: "Designation",
    },
    {
      value: currentUser.emailid,
      title: "Email Id",
    },
  ];
  
  const OverallList = () => {
    const { currentUser } = useContext(AuthContext);
    const overallData = overall(currentUser);
  
    return (
      <ul className="overall-list">
        {overallData.map((item, index) => (
          <li className="overall-list__item" key={`overall-${index}`}>
            <div className="overall-list__item__icon">
              {icons[index]}
            </div>
            <div className="overall-list__item__info">
              <div className="title">
                {item.value}
              </div>
              <span>{item.title}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
export default OverallList;
  