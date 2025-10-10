import AdminSidePanel from "../../components/AdminSidePanel";
import { Routes, Route } from "react-router-dom";
import "../../styles/AdminPage.css";
import EditorMenu from "./EditorMenu";

export default function AdminPage() {
  return (
    <>
      <AdminSidePanel />

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<h1>Главная админки</h1>} />
          <Route path="/editor" element={<EditorMenu />} />
        </Routes>
      </div>
    </>
  );
}