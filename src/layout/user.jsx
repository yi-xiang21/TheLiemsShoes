import { Outlet } from "react-router-dom";
import Header from "../components/shared/Header.jsx";
import Footer from "../components/shared/Footer.jsx";

function User() {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default User;