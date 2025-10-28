import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

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
            const response = await fetch("/api/users/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, password }),
            });

            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg);
            }


            const user = await response.json();
            console.log(user);
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
            <img src="assets/textlogo.png" alt="Logo" />

            <span>
                Для входа в систему NKU Travel Guide<br />
                пожалуйста, введите ваш логин
            </span>

            <div className="login-inputs">
                <input
                    className="kutg-input"
                    type="text"
                    placeholder="Введите ваш логин"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    className="kutg-input"
                    type="password"
                    placeholder="Введите ваш пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="kutg-button" onClick={handleLogin}>
                    Войти
                </button>
            </div>

            {error && <p className="error-text">{error}</p>}

            <span>
                NKU Travel Guide<br />
                Лицензионное соглашение, политика конфиденциальности
            </span>
        </div>
    );
}
