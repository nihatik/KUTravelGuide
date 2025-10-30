import { Routes, Route } from "react-router-dom";
import "./AdminPage.css";
import EditorMenu from "./sections/editor/EditorMenu";
import AdminSidePanel from "@/pages/admin/features/AdminSidePanel";
import BuildingsAdminPage from "./sections/buildings/BuildingsAdminPage";
import UsersAdminPage from "./sections/users/UsersAdminPage";
import FeedbackAdminPage from "./sections/feedback/FeedbackAdminPage";
import FaquestionsAdminPage from "./sections/faquestions/FaquestionsAdminPage";

export default function AdminPage() {
  return (
    <>
      <AdminSidePanel />

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<h1>Главная админки</h1>} />
          <Route path="/editor" element={<EditorMenu />} />
          <Route path="/buildings" element={<BuildingsAdminPage />} />
          <Route path="/users" element={<UsersAdminPage />} />
          <Route path="/feedback" element={<FeedbackAdminPage />} />
          <Route path="/faquestions" element={<FaquestionsAdminPage />} />
        </Routes>
      </div>
    </>
  );
}