import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

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