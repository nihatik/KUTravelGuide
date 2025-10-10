import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  return (
    <nav id="header">
      <div id="links">
        <Link to="/">X</Link>
        <Link to="/admin">АДМИН ПАНЕЛЬ</Link>
      </div>
    </nav>
  );
}
