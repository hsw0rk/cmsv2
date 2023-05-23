import React, { useState, useEffect } from "react";
import "./asidebar.scss";
import { Link } from "react-router-dom";
import { images } from "../../../constants";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";
import ArrowIcon from "../../../Assets/arrowicon";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    setActiveItem("dashboard");
  }, []);

  const handleAccordionClick = () => {
    setOpen(!open);
  };

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
        <div>
          <Link
            to="/admin/dashboard"
            className={`sidebar__menu__item ${
              activeItem === "dashboard" ? "active" : ""
            }`}
            onClick={() => {
              setActiveItem("dashboard");
              closeSidebar();
            }}
          >
            <i
              className="bx bx-desktop pr-5 sidebar__menu__item__icon"
              style={{ fontSize: "25px" }}
            ></i>
            Dashboard
          </Link>
        </div>
        <Accordion
          transition={{
            duration: "300ms",
            timingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
        >
          <AccordionItem>
            <>
              <AccordionHeader
                className="flex sidebar__menu__item bg-transparent 
                justify-center items-center border-none text-gray-900 pt-1"
                onClick={handleAccordionClick}
              >
                <i
                  className="bx bx-hdd pr-5 sidebar__menu__item__icon"
                  style={{ fontSize: "25px"}}
                ></i>
                <span className="flex sidebar__menu__item"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    marginLeft:"-1.6rem", cursor:"pointer"
                  }}
                >
                  Master
                </span>
                <ArrowIcon rotate={open} style={{fontSize:"12px"}}/>
              </AccordionHeader>
              <AccordionBody className="list">
                <Link
                  to="/admin/regionmaster"
                  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "regionmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("regionmaster");
                    closeSidebar();
                  }}
                >
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-current-location pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Region Master
                  </div>
                </Link>
                <Link to="/admin/branchmaster" className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "branchmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("branchmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-map-pin pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Branch Master
                  </div>
                </Link>
                <Link to="/admin/verticalmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "verticalmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("verticalmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-file-find pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Vertical Master
                  </div>
                </Link>
                <Link to="/admin/productmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "productmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("productmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-box pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Product Master
                  </div>
                </Link>
                <Link to="/admin/principalmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "principalmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("principalmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-collection pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Principal Master
                  </div>
                </Link>
                <Link to="/admin/businessheadmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "businessheadmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("businessheadmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-briefcase pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Business Head Master
                  </div>
                </Link>
                <Link to="/admin/regionheadmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "regionheadmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("regionheadmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-folder-open pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Region Head Master
                  </div>
                </Link>
                <Link to="/admin/verticalheadmaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "verticalheadmaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("verticalheadmaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx  bx-folder-plus pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Vertical Head Master
                  </div>
                </Link>
                <Link to="/admin/employeemaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "employeemaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("employeemaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-user pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    Employee Master
                  </div>
                </Link>
                <Link to="/admin/comaster"  className={`pt-pl-1 sidebar__menu__item font-dark text-right ${
                    activeItem === "comaster" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem("comaster");
                    closeSidebar();
                  }}>
                  <div className="pt-pl-1 sidebar__menu__item font-dark text-right list">
                    <i
                      className="sidebar__menu__item__icon bx bx-user-plus pl-2"
                      style={{ fontSize: "25px", marginRight: "25px" }}
                    ></i>
                    CO Master
                  </div>
                </Link>
                
                
                <hr 
                style={{marginBottom:"8px",  borderWidth: "1px",
                borderStyle: "solid",  
                borderImage: "linear-gradient(to right, rgba(128, 128, 128, 0), rgba(128, 128, 128, 1), rgba(128, 128, 128, 0)) 1",
                }}/>
              </AccordionBody>
            </>
          </AccordionItem>
        </Accordion>

        <div>
          <>
            <Link
              to="/admin/approvalmaster"
              className={`sidebar__menu__item ${
                activeItem === "approvalmaster" ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem("approvalmaster");
                closeSidebar();
              }}
            >
              <i
                className="bx bx-user-pin pr-5 sidebar__menu__item__icon"
                style={{ fontSize: "25px" }}
              ></i>
              Approval Master
            </Link>
            <Link
              to="/admin/leads"
              className={`sidebar__menu__item ${
                activeItem === "leads" ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem("leads");
                closeSidebar();
              }}
            >
              <i
                className="bx bx-receipt pr-5 sidebar__menu__item__icon"
                style={{ fontSize: "25px" }}
              ></i>
              Leads
            </Link>
          </>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
