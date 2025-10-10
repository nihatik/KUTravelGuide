import { Routes, Route } from "react-router-dom";
import "@assets/styles/AdminPage.css";
import EditorPage from "./editor/EditorPage";
import AdminSidePanel from "@/components/features/Admin/AdminSidePanel";

export default function AdminPage() {
  return (
    <>
      <AdminSidePanel />

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<h1>Главная админки</h1>} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>
    </>
  );
}