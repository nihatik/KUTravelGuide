import "./RightPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleHalfStroke, faComments, faDoorOpen, faLanguage, faLocationDot, faMinus, faMobile, faPlus, faUniversity, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type RightPanelProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGetLocation: () => void;
};

export default function RightPanel({ onZoomIn, onZoomOut, onGetLocation }: RightPanelProps) {
  const [menuActive, setMenuActive] = useState(false);

  const [user, setUser] = useState({ name: "Гость", group: null as string | null, admin: null as boolean | null });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.name) setUser(user);
    }
  }, []);

  const quitAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser({ name: "Гость", group: null, admin: null });
  };

  const joinAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/login"
  };

  const showRightMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuActive(prev => !prev);
  };

  return (
    <div id={`right-panel`} className={`${menuActive ? "active" : ""}`}>
      <div className="right-buttons">
        <div className="top">
          <button onClick={showRightMenu} className={`right-menu-show-btn ${menuActive ? "active" : ""}`}>
            <FontAwesomeIcon className="fa-big icon" icon={faArrowLeft} />
          </button>
        </div>
        <div className="center">
          <button onClick={onZoomIn}>
            <FontAwesomeIcon className="fa-big" icon={faPlus} />
          </button>
          <button onClick={onZoomOut}>
            <FontAwesomeIcon className="fa-big" icon={faMinus} />
          </button>
          <button onClick={onGetLocation}>
            <FontAwesomeIcon className="fa-big" icon={faLocationDot} />
          </button>
        </div>
      </div>
      <div className="right-menu">
        <div className="logo-container">
          <img src="assets/logo.png"></img>
          <span className="logo-text">KU Travel Guide</span>
        </div>
        <div className="right-menu-content">
          <div className="profile">
            <div className="user-container">
              <img src="assets/account.png" alt="User Icon" />
              <div className="user-info">
                <span className="user-info-name">{user.name}</span>
                {user.group && <span className="user-info-group">{user.group.toUpperCase()}</span>}
              </div>
            </div>
            {user.group &&
              <div id="exit-link" onClick={quitAccount}>
                <FontAwesomeIcon className="fa-big icon" icon={faDoorOpen} />
                <a href="#">Выйти из аккаунта</a>
              </div>
            }
            {!user.group &&
              <div id="join-link" onClick={joinAccount}>
                <FontAwesomeIcon className="fa-big icon" icon={faDoorOpen} />
                <a href="#">Войти в аккаунт</a>
              </div>
            }
          </div>

          <div className="right-menu-links">

            {user.group && user.admin &&
              <div className="right-menu-link">
                <FontAwesomeIcon className="fa-big icon" icon={faUserTie} />
                <a href="/admin">Админ панель</a>
              </div>
            }
            <div className="right-menu-link">
              <FontAwesomeIcon className="fa-big icon" icon={faUniversity} />
              <a href="https://ku.edu.kz/">Сайт университета</a>
            </div>
            <div className="right-menu-link">
              <FontAwesomeIcon className="fa-big icon" icon={faMobile} />
              <div className="column">
                <a href="#">Android</a>
                <a href="#">IOS</a>
                <a href="#">MyNKU ???</a>
              </div>
            </div>
            <div className="right-menu-link">
              <FontAwesomeIcon className="fa-big icon" icon={faComments} />
              <div className="column">
                <a href="#">Обратная связь</a>
              </div>
            </div>
            <div className="right-menu-link">
              <FontAwesomeIcon className="fa-big icon" icon={faCircleHalfStroke} />
              <div>
                <a className="active" href="#">Светлая</a>
                <a href="#">Темная</a>
              </div>
            </div>
            <div className="right-menu-link">
              <FontAwesomeIcon className="fa-big icon" icon={faLanguage} />
              <div>
                <a className="active" href="#">RU</a>
                <a href="#">EN</a>
                <a href="#">KZ</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
