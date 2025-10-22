import "./LoginPage.css";

export default function LoginPage() {
    return (
        <>
            <div className="login-page">
                <img src="assets/textlogo.png" />
                <span>
                    Для входа в систему NKU Travel Guide<br></br>
                    пожалуйста введите в поле ниже вашу корпоративную почту
                </span>
                <div className="login-inputs">
                    <input className="kutg-input" type="text" placeholder="Введите вашу корпоративную почту" />
                    <input className="kutg-input" type="password" placeholder="Введите ваш пароль" />
                </div>
                <span>
                    NKU Travel Guide<br></br>
                    Лицензионное соглашение, политика конфиденциальности
                </span>
            </div>
        </>
    );
}