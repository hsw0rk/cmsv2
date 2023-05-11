import React, { useEffect, useState } from 'react'
import './sidebar.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { images } from '../../../constants'
import sidebarAdminNav from '../../../configs/sidebarAdminNav'
import axios from "axios";

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const location = useLocation()
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await axios.post("http://localhost:8800/api/auth/logout");
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
        const curPath = window.location.pathname.split('/admin/')[1]
        const activeItem = sidebarAdminNav.findIndex(item => item.section === curPath)
      
        if (activeItem >= 0) {
          setActiveIndex(activeItem)
        }
      }, [location])
      

    const closeSidebar = () => {
        document.querySelector('.main__content').style.transform = 'scale(1) translateX(0)'
        setTimeout(() => {
            document.body.classList.remove('sidebar-open')
            document.querySelector('.main__content').style = ''
        }, 500);
    }

    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img className='sd' src={images.logo} alt="fullsd" />
                <img className='sf' src={images.sf} alt="sf" />
                <div className="sidebar-close" onClick={closeSidebar}>
                    <i className='bx bx-x'></i>
                </div>
            </div>
            <div className="sidebar__menu">
                {
                    sidebarAdminNav.map((nav, index) => (
                        <Link to={nav.link} key={`nav-${index}`} className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={closeSidebar}>
                            <div className="sidebar__menu__item__icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar__menu__item__txt">
                                {nav.text}
                            </div>
                        </Link>
                    ))
                }
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
    )
}

export default Sidebar
