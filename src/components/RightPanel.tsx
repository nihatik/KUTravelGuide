import "./RightPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleHalfStroke, faComments, faDoorOpen, faLanguage, faLocationDot, faMinus, faMobile, faPlus, faMap, faUniversity, faUserTie, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type RightPanelProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGetLocation: () => void;
  onBackToMap?: () => void;
};

<<<<<<< Updated upstream
export default function RightPanel({ onZoomIn, onZoomOut, onGetLocation }: RightPanelProps) {
=======
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" {...props}><path fill="#1996a7" d="M389.2 48h70.7L327.3 224.2 487 464H344.6L241 311.7 123.5 464H52.7L202 277.4 50 48h145.1l92.1 132.3L389.2 48ZM364.4 421.8h39.1L151.1 88h-42L364.4 421.8Z"/></svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" {...props}><path fill="#1996a7" d="M412 129.3c-23.8-17.8-40.6-43.8-46.6-73.9h-69.9v330.6c0 35.9-29.1 65-65 65s-65-29.1-65-65 29.1-65 65-65c6.8 0 13.4 1 19.5 3V263.8c-6.4-.9-13-1.4-19.5-1.4-71.5 0-129.5 58-129.5 129.5S159 521.4 230.5 521.4 360 463.4 360 391.9V206.2c26.9 19.8 60 31.6 96 31.6v-73.2c-15.8-.1-31-5.1-44-13.3Z"/></svg>
);

export default function RightPanel({ onZoomIn, onZoomOut, onGetLocation, onBackToMap }: RightPanelProps) {
>>>>>>> Stashed changes
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
          {onBackToMap && (
            <button onClick={onBackToMap} title="Вернуться на карту">
              <FontAwesomeIcon className="fa-big" icon={faMap} />
            </button>
          )}
          <button onClick={onZoomIn}>
            <FontAwesomeIcon className="fa-big" icon={faPlus} />
          </button>
          <button onClick={onZoomOut}>
            <FontAwesomeIcon className="fa-big" icon={faMinus} fill="#1996a7"/>
          </button>
          <button onClick={onGetLocation}>
            <FontAwesomeIcon className="fa-big" icon={faLocationDot} />
          </button>
        </div>
      </div>
      <div className="right-menu">
        <div className="logo-container">
          <div className="row" style={{ alignItems: 'center' }}>
            <img src="assets/logo.png"></img>
            <span className="logo-text">KU Travel Guide</span>
          </div>
          <button className="logo-close-btn" onClick={showRightMenu} aria-label="Закрыть панель">
            <FontAwesomeIcon className="fa-big icon" icon={faXmark} />
          </button>
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

            <hr className="separator" />

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
                <a href="#">MyNKU</a>
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
