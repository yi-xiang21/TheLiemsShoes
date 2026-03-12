import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home" 
import AdminLayout from "./layout/admin"
import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"
import Orders from "./pages/admin/Orders"
import Account from "./pages/admin/Account"
import CreateAccount from "./pages/admin/CreateAccount" 
import EditAccount from "./pages/admin/EditAccount"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />}/> */}
        {/* Mặc định vào admin layout */}
        <Route path="/" element={<AdminLayout />}/>
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