import { Link } from "react-router-dom";
import "./AdminSidePanel.css";

export default function AdminSidePanel() {
  return (
    <div className="admin-sidepanel">
      <nav>
        <ul>
          <li><Link to="/admin"><div>Главная</div></Link></li>
          <li><Link to="/admin/buildings"><div>Здания</div></Link></li>
          <li><Link to="/admin/users"><div>Пользователи</div></Link></li>
          <li><Link to="/admin/feedback"><div>Обратная связь</div></Link></li>
          <li><Link to="/admin/faquestions"><div>FAQ</div></Link></li>
          <li><Link to="/admin/editor"><div>Редактор</div></Link></li>
        </ul>
        <ul>
          <li><Link to="/"><div>Выйти из Админки</div></Link></li>
        </ul>
      </nav>
    </div>
  );
}
