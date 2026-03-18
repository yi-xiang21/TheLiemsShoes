import { Outlet } from "react-router-dom";
import Header from "../components/shared/header";

function User() {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default User;