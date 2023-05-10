import React from 'react'
import './admin-layout.scss'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/Admin/sidebar/Sidebar'
import TopNav from '../Components/Admin/topnav/TopNav'

const MainLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    <TopNav />
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default MainLayout
