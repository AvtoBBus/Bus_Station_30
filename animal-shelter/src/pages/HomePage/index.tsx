//@ts-ignore
import Pets from "../../shared/assets/Pets.png"
//@ts-ignore
import Spaik from "../../shared/assets/spaik.jpg"
//@ts-ignore
import Marusya from "../../shared/assets/marusya.jpg"
//@ts-ignore
import Feya from "../../shared/assets/feya.png"

import Carousel from 'react-bootstrap/Carousel';

import "./style.css"
import { useNavigate } from "react-router";

export const HomePage = () => {

    const navigate = useNavigate();

    return <>
        <dialog className="dialog__container" id="registerDialog">
            <div className="forms">
                <div className="form register">
                    <span className="title">Регистрация</span>
                    <form action="#" className="registerForm">
                        <div className="input-field">
                            <input type="text" placeholder="Введите Логин" name="nickname" required />
                        </div>
                        <div className="input-field">
                            <input type="email" placeholder="Введите email" name="email" pattern="^\S+@\S+\.\S+$" required />
                        </div>
                        <div className="input-field">
                            <input type="text" placeholder="Введите телефон" name="phoneNumber" pattern="^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$" required />
                        </div>
                        <div className="input-field">
                            <input type="password" placeholder="Введите пароль" name="password" maxLength={20} minLength={3} required />
                        </div>
                        <div className="input-field button">
                            <button type="submit" >Зарегистрироваться</button>
                        </div>
                        <div className="input-field button">
                            <input type="button" value="Отменить" />
                        </div>
                    </form>
                </div>
            </div>
        </dialog>

        <dialog className="dialog__container" id="loginDialog">
            <div className="forms">
                <div className="form login">
                    <span className="title">Авторизация</span>
                    <form action="#" className="loginForm">
                        <div className="input-field">
                            <input type="nickname" placeholder="Введите свой логин" name="nickname" pattern="^\S+@\S+\.\S+$" required />
                        </div>
                        <div className="input-field">
                            <input type="password" placeholder="Введите свой пароль" name="password" maxLength={20} minLength={3} required />
                        </div>
                        <div className="input-field button">
                            <button type="submit" >Войти</button>
                        </div>
                        <div className="input-field button">
                            <input type="button" value="Отменить" />
                        </div>
                        <div className="reginster button">
                            <button className="nav_item--sign_up" >Зарегистрироваться</button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>

        <section className="main-info">
            <div className="main-info__header">
                <div className="main-info__text">
                    <div className="title">Приют, где добро побеждает</div>
                    <div className="subtitle">
                        <p>Наш приют отличается тем, что каждый из наших подопечных
                            находится под круглосуточной опекой человека!</p>
                        <p>Любой из наших подопечных может стать вам лучшим другом!</p>
                    </div>
                </div>
                <button className="main-info__button" onClick={() => navigate("/adopt")}>Взять питомца</button>
            </div>
            <div className="main-info_pic">
                <img src={Pets} alt="" />
            </div>
        </section>

        <section className="pets">
            <div className="pets__header">
                <div className="title">Наши питомцы</div>
            </div>
            <div className="pets__body">
                <div className="pets__column">
                    <div className="pets__content" onClick={() => navigate("/cats")}>
                        <p className="pets__title">Кошки</p>
                        <p className="pets__text">Самые милые котики различных пород, а также спасенные с улицы котята</p>
                    </div>
                </div>
                <div className="pets__column">
                    <div className="pets__content" onClick={() => navigate("/dogs")}>
                        <p className="pets__title">Собаки</p>
                        <p className="pets__text">Тренированные собаки и прелестные щенки от мала до велика. Каждый найдет себе друга!</p>
                    </div>
                </div>
            </div>
        </section>

        <div className="container">
            <section className="petsawai">
                <div className="petsawai__header">
                    <div className="title">Они готовы найти новый дом!</div>
                </div>

                <Carousel className="swiper">
                    <Carousel.Item>
                        <img src={Spaik} alt="" />
                        <Carousel.Caption>
                            <p style={{ fontSize: "22px" }}>Меня зовут Спайк, и я супер-пес!
                                У меня есть суперспособность влюблять в себя всех, я обожаю людей, гулять с ними и дарить свою любовь!</p>
                            <p style={{ fontSize: "18px" }}><b>Спайк</b></p>
                            <p style={{ fontSize: "14px" }}>Мальчик, 2 года</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={Marusya} alt="" />
                        <Carousel.Caption>
                            <p style={{ fontSize: "22px" }}>Меня зовут Маруся, я очень ласковая и любвеобильная кошка.
                                Eсли станешь моей семьей, то мы будем не разлей вода </p>
                            <p style={{ fontSize: "18px" }}><b>Маруся</b></p>
                            <p style={{ fontSize: "14px" }}>Девочка, 1 год</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={Feya} alt="" />
                        <Carousel.Caption>
                            <p style={{ fontSize: "22px" }}>Меня зовут Фея. Я очень стеснительная и милая собака.
                                Мне нужно внимание и доверие человека, и тогда я буду самой счастливой собакой!</p>
                            <p style={{ fontSize: "18px" }}><b>Фея</b></p>
                            <p style={{ fontSize: "14px" }}>Девочка, 1,5 года</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>

            </section>
        </div >
    </>
}