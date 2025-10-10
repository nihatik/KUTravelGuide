import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div id="admin">
      <Outlet />
    </div>
  );
}