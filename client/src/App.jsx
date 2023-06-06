import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css';      

import Dashboard from './Pages/User/Dashboard/Dashboard'
import AdminDashboard from './Pages/Admin/Dashboard/Dashboard'
import Login from "./Pages/Login/Login";
import Investments from "./Pages/User/Investments/Investments";
import Homeloans from "./Pages/User/Homeloans/Homeloans";
import Insurance from "./Pages/User/Insurance/Insurance";
import OrderBook from './Pages/User/orderbook/orderbook'
import Leads from './Pages/User/Leads/leads';
import Region from './Pages/Admin/Region/region';
import Branch from './Pages/Admin/Branch/branch';
import User from './Pages/Admin/AdminUser/User';
import Vertical from './Pages/Admin/Vertical/vertical';
import Product from './Pages/Admin/Product/product';
import Approval from './Pages/Admin/Approval/approval';
import Principal from './Pages/Admin/Principal/principal';
import Businesshead from './Pages/Admin/BusinessHead/businesshead';
import Regionhead from './Pages/Admin/RegionHead/regionhead';
import Verticalhead from './Pages/Admin/VerticalHead/verticalhead';
import CO from './Pages/Admin/CO/co';
import LeadAdmin from './Pages/Admin/LeadAdmin/leadAdmin';

import React, {useContext} from 'react';
import { AuthContext } from './context/authContext';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './Layout/admin-layout.scss'
import { Outlet } from 'react-router-dom'
import ASidebar from '../src/Components/Admin/sidebar/Sidebar'
import ATopNav from '../src/Components/Admin/topnav/TopNav'

import './Layout/main-layout.scss'

import Sidebar from '../src/Components/User/sidebar/Sidebar'
import TopNav from '../src/Components/User/topnav/TopNav'

function App() {
  const { currentUser, isAdmin } = useContext(AuthContext);

  const queryClient = new QueryClient();

  const AdminLayout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
            <ASidebar />
            <div className="main">
                <div className="main__content">
                    <ATopNav />
                    <Outlet />
                </div>
            </div>
        </div>
      </QueryClientProvider>
    );
  };

  const MainLayout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    <TopNav />
                    <Outlet />
                </div>
            </div>
        </div>
      </QueryClientProvider>
    );
  };


  const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
  
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
  
    // Check if the current user's role is in the allowedRoles array
    if (!allowedRoles.includes(currentUser.role)) {
      if (currentUser.role === 'Employee') {
        return (
          <Navigate
            to={`/employee/dashboard${location.search}`}
            replace
          />
        );
      } else if (currentUser.role === 'Admin') {
        return (
          <Navigate
            to={`/admin/dashboard${location.search}`}
            replace
          />
        );
      } else {
        return <Navigate to="/" replace />; // Redirect to a default page if the role is not recognized
      }
    }
  
    return children;
  };
  
  
  const ProtectedAdminRoute = ({ children }) => {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        {children}
      </ProtectedRoute>
    );
  };

  const ProtectedEmployeeRoute = ({ children }) => {
    return (
      <ProtectedRoute allowedRoles={['Employee']}>
        {children}
      </ProtectedRoute>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "regionmaster",
          element: <Region />,
        },
        {
            path: "branchmaster",
            element: <Branch />,
          },
          {
            path: "verticalmaster",
            element: <Vertical />,
          },
          {
            path: "productmaster",
            element: <Product />,
          },
          {
            path: "principalmaster",
            element: <Principal />,
          },
          {
            path: "businessheadmaster",
            element: <Businesshead />,
          },
          {
            path: "regionheadmaster",
            element: <Regionhead />,
          },
          {
            path: "verticalheadmaster",
            element: <Verticalhead />,
          },
          {
            path: "employeemaster",
            element: <User />,
          },
          {
            path: "comaster",
            element: <CO />,
          },
          {
            path: "approvalmaster",
            element: <Approval />,
          },
          {
            path: "leads",
            element: <LeadAdmin />,
          },
      ],
    },
    {
        path: "/employee",
        element: (
          <ProtectedEmployeeRoute>
            <MainLayout />
          </ProtectedEmployeeRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "investments",
            element: <Investments />,
          },
          {
            path: "homeloans",
            element: <Homeloans />,
          },
          {
            path: "insurance",
            element: <Insurance />,
          },
          {
            path: "orderbook",
            element: <OrderBook />,
          },
          {
            path: "leads",
            element: <Leads />,
          },
        ],
      },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;