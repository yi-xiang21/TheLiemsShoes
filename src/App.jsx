import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx" 
import AdminLayout from "./layout/Admin.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx"
import Products from "./pages/admin/Products.jsx"
import Orders from "./pages/admin/Orders.jsx"
import Account from "./pages/admin/Account.jsx"
import CreateAccount from "./pages/admin/CreateAccount.jsx" 
import EditAccount from "./pages/admin/EditAccount.jsx"
import Login from "./pages/Login&Register.jsx"
import UserLayout from "./layout/User.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
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
