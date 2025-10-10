import { Outlet } from "react-router-dom";
import Header from "../Header";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <div id="main">
        <Outlet />
      </div>
    </>
  );
}