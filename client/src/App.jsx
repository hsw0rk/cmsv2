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
import OrderBook from './Pages/User/orderbook/orderbook'
import Region from './Pages/Admin/Region/region';
import Branch from './Pages/Admin/Branch/branch';
import User from './Pages/Admin/AdminUser/User';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/e" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="investments" element={<Investments />} />
                    <Route path="homeloans" element={<Investments />} />
                    <Route path="insurance" element={<Investments />} />
                    <Route path="orderbook" element={<OrderBook />} />
                    <Route path="settings" element={<Investments />} />
                </Route>
                <Route path="/a" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="regionmaster" element={<Region />} />
                    <Route path="branchmaster" element={<Branch />} />
                    <Route path="usermaster" element={<User />} />
                    <Route path="approvalmaster" element={<Investments />} />
                    <Route path="productmaster" element={<Investments />} />
                    <Route path="verticalmaster" element={<OrderBook />} />
                    <Route path="leads" element={<Investments />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
