import { Link } from "react-router-dom";
import "../styles/AdminSidePanel.css";

export default function AdminSidePanel() {
  return (
    <div className="admin-sidepanel">
      <nav>
        <ul>
          <li><Link to="/admin"><div>Главная</div></Link></li>
          <li><Link to="/admin/redact"><div>Редактор OLD</div></Link></li>
          <li><Link to="/admin/planeditor"><div>Планировщик</div></Link></li>
          <li><Link to="/admin/editor"><div>Редактор</div></Link></li>
        </ul>
        <ul>
          <li><Link to="/"><div>Выйти из Админки</div></Link></li>
        </ul>
      </nav>
    </div>
  );
}
