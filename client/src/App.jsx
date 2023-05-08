import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css';      
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
import MainLayout from './Layout/MainLayout'
import Login from "./Pages/Login/Login";
import Investments from "./Pages/Investments/Investments";
import OrderBook from './Pages/orderbook/orderbook'
import Region from './Pages/Admin/Region/region';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="investments" element={<Investments />} />
                    <Route path="homeloans" element={<Investments />} />
                    <Route path="adminregion" element={<Region />} />
                    <Route path="settings" element={<Investments />} />
                    <Route path="cmsverticalformdata" element={<OrderBook />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
