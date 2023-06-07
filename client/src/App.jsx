import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css';      
import Dashboard from './Pages/User/Dashboard/Dashboard'
import AdminDashboard from './Pages/Admin/Dashboard/Dashboard'
import MainLayout from './Layout/MainLayout'
import AdminLayout from './Layout/AdminLayout'
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
  BrowserRouter, Routes, Route,
  Navigate,
  useLocation,
} from "react-router-dom";


function App() {

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

  
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/employee/*" element={<ProtectedRoute allowedRoles={['Employee']}><MainLayout /></ProtectedRoute>}>
                <Route path="dashboard" index element={<Dashboard />} />
                <Route path="investments" element={<Investments />} />
                <Route path="homeloans" element={<Homeloans />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="orderbook" element={<OrderBook />} />
                <Route path="leads" element={<Leads />} />
            </Route>
            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" index element={<AdminDashboard />} />
                <Route path="regionmaster" index element={<Region />} />
                <Route path="branchmaster" element={<Branch />} />
                <Route path="verticalmaster" element={<Vertical />} />
                <Route path="productmaster" element={<Product />} />
                <Route path="principalmaster" element={<Principal />} />
                <Route path="businessheadmaster" element={<Businesshead />} />
                <Route path="regionheadmaster" element={<Regionhead />} />
                <Route path="verticalheadmaster" element={<Verticalhead />} />
                <Route path="employeemaster" element={<User />} />
                <Route path="comaster" element={<CO />} />
                
                <Route path="approvalmaster" element={<Approval />} />
                <Route path="leads" element={<LeadAdmin />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
}

export default App