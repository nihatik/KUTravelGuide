import "@styles/LoginPage.css";

export default function LoginPage() {
    return (
        <>
            <img src="assets/textlogo.png" />
            <div className="login-container">
                <span>Для входа в систему NKU Travel Guide</span>
                <span>пожалуйста введите в поле ниже вашу корпоративную почту</span>
            </div>
            <div>
                <input className="kutg-input" type="text" placeholder="Введите вашу корпоративную почту" />
                <input className="kutg-input" type="password" placeholder="Введите ваш пароль" />
            </div>
            <div className="login-container">
                <span>
                    NKU Travel Guide
                </span>
                <span>
                    Лицензионное соглашение, политика конфиденциальности
                </span>
            </div>
        </>
    );
}