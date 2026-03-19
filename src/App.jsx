import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home" 
import AdminLayout from "./layout/Admin"
import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"
import Orders from "./pages/admin/Orders"
import Account from "./pages/admin/Account"
import CreateAccount from "./pages/admin/CreateAccount" 
import EditAccount from "./pages/admin/EditAccount"
import Login from "./pages/Login&Register"
import User from "./layout/User"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />}>
          <Route index element={<Home />} />
          <Route path="Login" element={<Login />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="account" element={<Account />} />
          <Route path="CreateAccount" element={<CreateAccount/>} />
          <Route path="EditAccount" element={<EditAccount/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App