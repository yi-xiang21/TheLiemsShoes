import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header.jsx";
import Footer from "../components/shared/Footer.jsx";
import { useAuth } from "../context/useAuth.js";
import UserLoadingOverlay from "../components/shared/UserLoadingOverlay.jsx";

function User() {
  const { loading } = useAuth();

  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
      <UserLoadingOverlay show={loading} text="Đang đồng bộ tài khoản..." />
    </>
  );
}

export default User;