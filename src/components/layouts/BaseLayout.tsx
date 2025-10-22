import { Outlet } from "react-router-dom";

export default function BaseLayout() {
  return (
    <>
      <div id="main">
        <Outlet />
      </div>
    </>
  );
}