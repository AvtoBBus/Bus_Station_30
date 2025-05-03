import { Carousel } from "react-bootstrap"

//@ts-ignore
import Happy1 from "../../shared/assets/happy1.jpg"
//@ts-ignore
import Happy2 from "../../shared/assets/happy2.jpg"
//@ts-ignore
import Happy3 from "../../shared/assets/happy3.jpg"

import "./style.css"
import { useState } from "react"
import { UserWantAdoptType } from "../../shared/DataTypes"
import { UserApi } from "../../shared/OpenApi/UserApi"
import { ActionForm } from "../../components/ActionForm"


export const AdoptPage = () => {

    return <>
        <section className="adopt">
            <div className="container">
                <h2>Как взять питомца из нашего приюта</h2>
                <p className="subtitle">Процесс усыновления прост и прозрачен. Мы всегда рады помочь вам найти верного друга!</p>

                <div className="adopt-content">

                    <div className="adopt-requirements-container">
                        <h3>Требования к будущим владельцам:</h3>
                        <div className="adopt-requirements">
                            <ul>
                                <li>Быть совершеннолетним</li>
                                <li>Обеспечить питомцу достойные условия проживания</li>
                                <li>Быть готовым к ответственности за животное</li>
                                <li>Быть готовым к финансовым затратам на корм, лечение и т.д.</li>
                            </ul>
                        </div>
                    </div>
                    <ActionForm
                        isModal={false}
                        model="adopt"
                        title="Заполните форму, чтобы подать заявку на усыновление:"
                        submitMethod={async (formData: UserWantAdoptType) => {
                            const userApi = new UserApi();
                            return userApi.sendAdoptForm(formData);
                        }}
                        onClose={null}
                    />
                    <div className="adopt-slider-container">
                        <h3>Посмотрите, как счастливы наши бывшие подопечные:</h3>
                        <Carousel className="swiper">
                            <Carousel.Item >
                                <img src={Happy1} alt="" style={{ marginBottom: 0 }} />
                            </Carousel.Item>
                            <Carousel.Item >
                                <img src={Happy2} alt="" style={{ marginBottom: 0 }} />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src={Happy3} alt="" style={{ marginBottom: 0 }} />
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    </>
}