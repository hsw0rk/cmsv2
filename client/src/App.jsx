import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css';      
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/employee" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="investments" element={<Investments />} />
                    <Route path="homeloans" element={<Homeloans />} />
                    <Route path="insurance" element={<Insurance />} />
                    <Route path="orderbook" element={<OrderBook />} />
                    <Route path="leads" element={<Leads />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="regionmaster" index element={<Region />} />
                    <Route path="branchmaster" element={<Branch />} />
                    <Route path="usermaster" element={<User />} />
                    <Route path="approvalmaster" element={<Approval />} />
                    <Route path="productmaster" element={<Product />} />
                    <Route path="verticalmaster" element={<Vertical />} />
                    <Route path="leads" element={<Leads />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
