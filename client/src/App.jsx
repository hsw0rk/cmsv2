import './assets/libs/boxicons-2.1.1/css/boxicons.min.css'
import './scss/App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blank from './Pages/Blank'
import Dashboard from './Pages/Dashboard/Dashboard'
import MainLayout from './Layout/MainLayout'
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Investments from "./Pages/Investments/Investments";
import OrderBook from './Pages/orderbook/orderbook'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="investments" element={<Investments />} />
                    <Route path="homeloans" element={<Blank />} />
                    <Route path="insurance" element={<Blank />} />
                    <Route path="settings" element={<Blank />} />
                    <Route path="cmsverticalformdata" element={<OrderBook />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
