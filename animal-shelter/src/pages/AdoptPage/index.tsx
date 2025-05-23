import "./style.css"
import { useContext, useState } from "react"
import { UserWantAdoptType } from "../../shared/DataTypes"
import { UserApi } from "../../shared/OpenApi/UserApi"
import { ActionForm } from "../../components/ActionForm"
import { PetsContainer } from "../../shared/container/PetsContainer"
import { CardImg } from "../../components/CardImg"


export const AdoptPage = () => {

    const { pets, setPets } = useContext(PetsContainer);

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
                    <h3 className="adopt-slider-title">Посмотрите, каких красавцев уже приютили:</h3>
                    <div className="adopt-slider-container">
                        {pets && pets.filter(p => p.status.toLowerCase() === "усыновлен").map(data => {
                            return <>
                                <div className="animal-card">
                                    <CardImg id={data._id} needLoad={false} />
                                    <h3>{data.animalName}</h3>
                                    <div className="animal-card__text">
                                        <p className="text__left">Порода:</p>
                                        <p>{data.breed || 'Неизвестна'}</p>
                                        <p className="text__left">Возраст(лет):</p>
                                        <p>{data.age || 'Неизвестен'}</p>
                                        <p className="text__left">Болезни:</p>
                                        <p>{data.illness || 'Нет болезней'}</p>
                                        <p className="text__left">Статус:</p>
                                        <p>{data.status || 'Неизвестен'}</p>
                                    </div>
                                    <p>{data.features}</p>
                                </div>
                            </>
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}