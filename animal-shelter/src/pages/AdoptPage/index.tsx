import "./style.css"
import { useContext, useState } from "react"
import { AnimalType, UserWantAdoptType } from "../../shared/DataTypes"
import { UserApi } from "../../shared/OpenApi/UserApi"
import { ActionForm } from "../../components/ActionForm"
import { PetsContainer } from "../../shared/container/PetsContainer"
import { CardImg } from "../../components/CardImg"
import { UserContainer } from "../../shared/container/UserContainer"
import { PetsApi } from "../../shared/OpenApi/PetsApi"


export const AdoptPage = () => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [editAnimal, setEditAnimal] = useState<AnimalType | null>(null);
    const { pets, setPets } = useContext(PetsContainer);
    const { user } = useContext(UserContainer);

    const deleteAnimalHandler = (animalId: string) => {
        if (user?.userId !== "-1" && user?.userRole === "admin") {
            const api = new PetsApi();
            api.deleteAnimal(animalId)
                .then(r => {
                    api.getPetsList()
                        .then(list => {
                            setPets(list);
                        })
                })
        }
    }

    const changeValue = (key: string, newValue: string | number) => {
        if (editAnimal) {
            const copy = JSON.parse(JSON.stringify(editAnimal)) as AnimalType;
            //@ts-ignore
            if (copy.hasOwnProperty(key)) {
                //@ts-ignore
                copy[key] = newValue;
                setEditAnimal(copy);
            }
        }
    }

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
                                    <CardImg id={data._id} needLoad={editMode} />
                                    <h3>{data.animalName}</h3>
                                    <div className="animal-card__text">
                                        <p className="text__left">Порода:</p>
                                        {editMode && editAnimal?._id === data._id
                                            ? <input className="text__edit-input" value={editAnimal?.breed} onChange={(e) => changeValue("breed", e.target.value)} />
                                            : <p>{data.breed || 'Неизвестна'}</p>}
                                        <p className="text__left">Возраст(лет):</p>
                                        {editMode && editAnimal?._id === data._id
                                            ? <input className="text__edit-input" value={editAnimal?.age} onChange={(e) => changeValue("age", Number(e.target.value))} type="number" />
                                            : <p>{data.age || 'Неизвестен'}</p>}
                                        <p className="text__left">Болезни:</p>
                                        {editMode && editAnimal?._id === data._id
                                            ? <input className="text__edit-input" value={editAnimal?.illness} onChange={(e) => changeValue("illness", e.target.value)} />
                                            : <p>{data.illness || 'Нет болезней'}</p>}
                                        <p className="text__left">Статус:</p>
                                        {editMode && editAnimal?._id === data._id
                                            ? <>
                                                <select className="text__edit-input" value={editAnimal?.status} onChange={(e) => changeValue("status", e.target.value)}>
                                                    <option value="в приюте">в приюте</option>
                                                    <option value="усыновлен">усыновлен</option>
                                                    <option value="передержка">передержка</option>
                                                    <option value="на лечении">на лечении</option>
                                                </select>
                                            </>
                                            : <p>{data.status || 'Неизвестен'}</p>}
                                    </div>
                                    {editMode && editAnimal?._id === data._id
                                        ? <input className="text__edit-input" value={editAnimal?.features} onChange={(e) => changeValue("features", e.target.value)} />
                                        : <p>{data.features}</p>}
                                    {user?.userId !== "-1"
                                        && user?.userRole === "admin"
                                        && <div className="animal-card__buttons-container">
                                            <button onClick={(e) => {
                                                if (editMode) {
                                                    if (editAnimal?._id === data._id) {
                                                        const api = new PetsApi();
                                                        api.editAnimal(editAnimal)
                                                            .then(r => {
                                                                api.getPetsList()
                                                                    .then(list => {
                                                                        setPets(list);
                                                                        setEditAnimal(null);
                                                                        setEditMode(false);
                                                                        (e.target as Element).scrollIntoView();
                                                                    })
                                                            })
                                                    }
                                                }
                                                else {
                                                    setEditMode(true)
                                                    setEditAnimal(data);
                                                }

                                            }}>{editMode && editAnimal?._id === data._id ? "Сохранить" : "Изменить"}</button>
                                            <button onClick={() => {
                                                if (editMode) {
                                                    if (editAnimal?._id === data._id) {
                                                        setEditAnimal(null);
                                                        setEditMode(false);
                                                    }
                                                }
                                                else deleteAnimalHandler(data._id)
                                            }}>
                                                {editMode && editAnimal?._id === data._id ? "Отменить" : "Удалить"}</button>
                                        </div>}
                                </div>
                            </>
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}