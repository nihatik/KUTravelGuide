import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayout from "./components/layouts/BaseLayout";
import AdminLayout from "./components/features/Admin/AdminLayout";
import Main from "./pages/main/Main";
import AdminPage from "./pages/admin/AdminPage";
import BuildingMap from "./components/features/Building/BuildingMap";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/map" element={<BuildingMap />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
