import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { UsersHttp } from "@/services/api/UsersHttp";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");

        if (!login) {
            setError("Введите вашу корпоративную почту");
            return;
        }

        try {
            const user = await UsersHttp.login(login, password);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="hero">
                    <div
                        className="hero-logo"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate('/')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
                    >KU</div>
                    <h1>Путеводитель</h1>
                    <p>Быстрый доступ к корпусам и сервисам</p>
                </div>

                <div className="auth-card">
                    <h2>Авторизация</h2>

                    <div className="login-inputs">
                        <input
                            className="kutg-input"
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <input
                            className="kutg-input"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="kutg-button primary" onClick={handleLogin}>
                            Войти
                        </button>
                    </div>

                    {error && <p className="error-text">{error}</p>}
                </div>
            </div>
        </div>
    );
}
