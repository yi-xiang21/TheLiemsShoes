import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home.jsx" 
import AdminLayout from "./layout/Admin.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx"
import Products from "./pages/admin/Products"
import Orders from "./pages/admin/Orders.jsx"
import Account from "./pages/admin/Account"
import Login from "./pages/Login&Register.jsx"
import UserLayout from "./layout/User.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import Shop from "./pages/Shop.jsx"
import LogOut from "./pages/LogOutPage.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import LayoutShopProduct from "./layout/ShopProduct.jsx"
import About from "./pages/About.jsx"
import Category from "./pages/admin/Category"
import Cart from "./pages/Cart.jsx"
import Checkout from "./pages/Checkout";
import Detail from "./pages/Detail.jsx"
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="Login" element={<Login />} />
          <Route path="UserProfile" element={<UserProfile />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="my-orders/:id" element={<OrderDetail />} />
          <Route path="About" element={<About />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="Checkout" element={<Checkout />} />
            <Route path="Shop" element={<LayoutShopProduct />} >
              <Route index element={<Shop />} />
            </Route>
          <Route path="product/:id" element={<Detail />} />
          <Route path="Logout" element={<LogOut />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="account" element={<Account />} />
          <Route path="categories" element={<Category />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
