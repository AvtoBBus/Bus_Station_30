import { Link, useNavigate } from "react-router"


//@ts-ignore
import Logo from "../../shared/assets/Logo.png"

import "./style.css"
import { useContext, useEffect, useState } from "react";
import { UserContainer } from "../../shared/container/UserContainer";

export const Navigation = (props: { loginButtonClick: Function, onLogout: Function }) => {

    const navigate = useNavigate();
    const { user } = useContext(UserContainer);

    const [buttonText, setButtonText] = useState<string>("")

    useEffect(() => {
        if (user && user.userId && user?.userId !== "-1") setButtonText(user.userName);
        else setButtonText("Пользователь");
    }, [user])

    return <div className="header">
        <nav className="header__nav">
            <img className="header__logo" src={Logo} alt="" onClick={() => navigate("/")} />

            <Link to="/">О нас</Link>
            <Link to="/our-pets">Наши питомцы</Link>
            <Link to="/donate">Как помочь</Link>
            <Link to="/adopt">Взять питомца</Link>
            <Link to="/contacts">Контакты</Link>

            {user && user.userId && user.userId !== "-1" && <Link to="/lk">Личный кабинет</Link>}

            {
                user && user.userId && user.userId !== "-1" ? <>
                    <button
                        className="nav_item--login"
                        onMouseEnter={() => setButtonText("Выйти из аккаунта")}
                        onMouseLeave={() => setButtonText(user.userName)}
                        onClick={(e) => {
                            e.preventDefault();
                            props.onLogout();
                            navigate("/");
                        }}>{buttonText}</button>
                </> : <>
                    <button className="nav_item--login" onClick={(e) => { e.preventDefault(); props.loginButtonClick(); }}>Войти в систему</button>
                </>
            }

        </nav>
    </div>
}