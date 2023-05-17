import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation } from "react-router-dom";
import { images } from "../../../constants";
import sidebarAdminNav from "../../../configs/sidebarAdminNav";
import sidebarAdminNavs from "../../../configs/sidebarAdminNavs";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";
// import {Chevron} from "../components"

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const curPath = window.location.pathname.split("/admin/")[1];
    const activeItem = sidebarAdminNav.findIndex(
      (item) => item.section === curPath
    );

    if (activeItem >= 0) {
      setActiveIndex(activeItem);
    }
  }, [location]);


  const closeSidebar = () => {
    document.querySelector(".main__content").style.transform =
      "scale(1) translateX(0)";
    setTimeout(() => {
      document.body.classList.remove("sidebar-open");
      document.querySelector(".main__content").style = "";
    }, 500);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img className="sd" src={images.logo} alt="fullsd" />
        <img className="sf" src={images.sf} alt="sf" />
        <div className="sidebar-close" onClick={closeSidebar}>
          <i className="bx bx-x"></i>
        </div>
      </div>
      <div className="sidebar__menu">
        {sidebarAdminNav.map((nav, index) => (
          <Link
            to={nav.link}
            key={`nav-${index}`}
            className={`sidebar__menu__item ${
              activeIndex === index && "active"
            }`}
            onClick={closeSidebar}
          >
            <div className="sidebar__menu__item__icon">{nav.icon}</div>
            <div className="sidebar__menu__item__txt">{nav.text}</div>
          </Link>
        ))}
        <div>
        {sidebarAdminNav.map((nav, index) => (
          <Link to="/admin/dashboard" key={`nav-${index}`} className={`sidebar__menu__item ${
              activeIndex === index && "active"
            }`}>Dashboard</Link>
        ))}
        </div>
        <Accordion
          transition={{
            duration: "300ms",
            timingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
        >
          <AccordionItem className="font-sans">
            {({ open }) => (
              <>
                <AccordionHeader className="flex bg-transparent justify-center items-center border-none text-gray-900 p-3">
                  <span
                  style={{marginLeft:"100px"}}>Master</span>
                  <svg
                    class={`w-1 h-1 ${!open ? "" : "rotate-90"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{justifyContent:"flex-end",marginLeft:"70px",marginTop:"-3px"}}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </AccordionHeader>

                <AccordionBody>
                  <div className="p-2 font-dark text-right pr-7"><i className='bx bx-current-location '></i>Region Master</div>
                  <div className="p-2 font-dark text-right pr-7">Branch Master</div>
                  <div className="p-2 font-dark text-right pr-7">Employee Master</div>
                  <div className="p-2 font-dark text-right pr-7">Product Master</div>
                  <div className="p-2 font-dark text-right pr-7">Vertical Master</div>
                </AccordionBody>
              </>
            )}
          </AccordionItem>
        </Accordion>
        {sidebarAdminNavs.map((nav, index) => (
          <><Link
            to={nav.link}
            key={`nav-${index}`}
            className={`sidebar__menu__item ${
              activeIndex === index && "active"
            }`}
            onClick={closeSidebar}
          >
            Approval Master
          </Link>
          <Link
          to={nav.link}
          key={`nav-${index}`}
          className={`sidebar__menu__item ${
            activeIndex === index && "active"
          }`}
          onClick={closeSidebar}
        >
          Leads
        </Link></>
        ))}
        <div className="sidebar__menu__item">
          {/* <div className="sidebar__menu__item__icon">
                        <i className='bx bx-log-out'></i>
                    </div> */}
          {/* <div className="sidebar__menu__item__txt">
                        <button onClick={handleLogout} >
                            Log out
                        </button>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
