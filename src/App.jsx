import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AdminLayout from "./layout/admin"
import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"
import Orders from "./pages/admin/Orders"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App