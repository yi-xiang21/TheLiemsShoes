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
import UserProfile from "./pages/UserProfile.jsx"
import Shop from "./pages/Shop.jsx"
import LogOut from "./pages/LogOutPage.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import LayoutShopProduct from "./layout/ShopProduct.jsx"
import About from "./pages/About.jsx"
import Category from "./pages/admin/Category.jsx"
import CreateCategory from "./pages/admin/CreateCategory.jsx"
import EditCategory from "./pages/admin/EditCategory.jsx"
import CreateProducts from "./pages/admin/CreateProducts.jsx"
import EditProducts from "./pages/admin/EditProducts.jsx"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="Login" element={<Login />} />
          <Route path="UserProfile" element={<UserProfile />} />
          <Route path="About" element={<About />} />
            <Route path="Shop" element={<LayoutShopProduct />} >
              <Route index element={<Shop />} />
            </Route>
          <Route path="Logout" element={<LogOut />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="CreateProducts" element={<CreateProducts />} />
          <Route path="EditProducts" element={<EditProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="account" element={<Account />} />
          <Route path="categories" element={<Category />} />
          <Route path="CreateCategory" element={<CreateCategory />} />
          <Route path="EditCategory" element={<EditCategory />} />
          <Route path="CreateAccount" element={<CreateAccount/>} />
          <Route path="EditAccount" element={<EditAccount/>} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
