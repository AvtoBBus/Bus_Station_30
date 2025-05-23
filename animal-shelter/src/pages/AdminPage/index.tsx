import { useContext, useEffect, useRef, useState } from "react"
import { UserContainer } from "../../shared/container/UserContainer"
import { useNavigate } from "react-router";
import { UserApi } from "../../shared/OpenApi/UserApi";

import "./style.css"
import { NewAnimalType, User } from "../../shared/DataTypes";
import { PetsApi } from "../../shared/OpenApi/PetsApi";
import { AnimalAdoptReminder } from "../../components/AnimalAdoptReminder";


export const AdminPage = (props: {}) => {

    const initAnimal: NewAnimalType = {
        animalName: "",
        animalType: 'cat',
        breed: "",
        age: 0,
        features: "",
        illness: "",
        status: "в приюте"
    }

    const initUser: User = {
        userId: "-1",
        userName: "anonim",
        userRole: "anonim",
        city: "nowhere",
        phone: "unknown",
        email: "unknown",
        userActions: []
    }

    const convertAction = {
        DONATE: "Пожертование",
        ADOPT: "Усыновление",
        VOLUNTEER: "Заявка на волонтёрство",
    }

    const convertAnimalType = {
        "dog": "собака",
        "cat": "кошка"
    }

    const { user, forceUpdateUser } = useContext(UserContainer);
    const navigate = useNavigate();

    const [newAnimal, setNewAnimal] = useState<NewAnimalType>(initAnimal);
    const [animalFile, setAnimalFile] = useState<File | null>(null);
    const [editUserInfo, setEditUserInfo] = useState<User | null>(null);
    const [isInfoEdit, setIsInfoEdit] = useState<boolean>(false);

    const reminderRef = useRef<HTMLDialogElement>(null);


    useEffect(() => {
        const userApi = new UserApi();
        userApi.userInfo()
            .then(r => {
                if (!r || user?.userId === "-1") navigate('/')
            })
    }, [])

    useEffect(() => {
        if (user && user.userId !== "-1" && !editUserInfo) setEditUserInfo(user);
    }, [user])

    const updValue = (field: keyof typeof initAnimal, value: string | number) => {
        const copy = JSON.parse(JSON.stringify(newAnimal));
        copy[field] = value;
        setNewAnimal(copy);
    }

    const getValue = (field: keyof typeof initAnimal) => {
        return newAnimal[field];
    }

    const addNewAnimalHandler = () => {
        if (animalFile) {
            const petsApi = new PetsApi();
            petsApi.addNewAnimal(getValue('animalType').toString(), newAnimal, animalFile)
                .then(r => {
                    if (r.status < 400) {
                        setNewAnimal(initAnimal);
                        setAnimalFile(null);
                        alert(`${newAnimal.animalName} успешно добавлен в базу!`);
                    }
                })
        }
    }

    const updUserInfo = (field: keyof typeof initUser, value: string) => {
        const copy = JSON.parse(JSON.stringify(editUserInfo));
        if (copy.hasOwnProperty(field)) {
            copy[field] = value;
            setEditUserInfo(copy)
            !isInfoEdit && setIsInfoEdit(true)
        }
    }

    return <>

        <dialog ref={reminderRef} style={{ borderRadius: "24px", border: "none" }}>
            <AnimalAdoptReminder
                onClose={() => {
                    reminderRef && reminderRef.current?.close();
                }} />
        </dialog>

        <section className="admin-panel" id="admin-panel-section">

            <div className="container">
                <h2>Информация о пользователе</h2>
                <div className="user-info">
                    <span>Имя пользователя: <input value={editUserInfo?.userName} onChange={(e) => updUserInfo("userName", e.target.value)} /></span>
                    <span>Ваша роль: {editUserInfo?.userRole}</span>
                    <span>Номер телефона: <input value={editUserInfo?.phone} onChange={(e) => updUserInfo("phone", e.target.value)} /></span>
                    <span>Почта: <input value={editUserInfo?.email} onChange={(e) => updUserInfo("email", e.target.value)} /></span>
                    <span>Город: <input value={editUserInfo?.city} onChange={(e) => updUserInfo("city", e.target.value)} /></span>
                    {
                        isInfoEdit && <>
                            <div className="buttons-container--edit-user-info">
                                <button
                                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                                    onClick={(e) => {
                                        if (editUserInfo) {
                                            const api = new UserApi();
                                            api.updateUserInfo(editUserInfo)
                                                .then(() => {
                                                    forceUpdateUser()
                                                    setIsInfoEdit(false);
                                                })
                                                .catch(() => {
                                                    setEditUserInfo(user);
                                                })
                                        }
                                    }}>Сохранить</button>
                                <button
                                    disabled={false}
                                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                                    onClick={() => {
                                        setEditUserInfo(user);
                                        setIsInfoEdit(false);
                                    }}
                                >Отменить</button>
                            </div>
                        </>
                    }
                </div>
            </div>

            <div className="container">
                <h2>История действий</h2>
                <div className="user-info">
                    {user && user.userActions && user?.userActions.map(action => {
                        return <div style={{ borderBottom: "1px solid black" }}>
                            {user
                                && user.userId !== "-1"
                                && user.userRole === "admin"
                                && <p><b>Клиент:</b> {action.name ?? "Аноним"}</p>}

                            {user
                                && user.userId !== "-1"
                                && user.userRole !== "admin" ?
                                <p>Статус: {action.status}</p>
                                : <span>
                                    Статус:
                                    <select
                                        value={action.status}
                                        onChange={(e) => {
                                            const api = new UserApi();
                                            //@ts-ignore
                                            api.updateActionStatus(action._id, e.target.value)
                                                .then(() => forceUpdateUser())
                                        }}>
                                        <option value="Ожидание">Ожидание</option>
                                        <option value="Одобрено">Одобрено</option>
                                        <option value="Отклонено">Отклонено</option>
                                    </select>
                                </span>}
                            <p>Что делали: {convertAction[action.action as keyof typeof convertAction]}</p>
                            {action.animalType && <>
                                <div style={{ display: "flex" }}>
                                    <p>Тип животного: {convertAnimalType[action.animalType as keyof typeof convertAnimalType]}</p>
                                    <button
                                        onClick={() => {
                                            reminderRef && reminderRef.current?.showModal();
                                        }}
                                        style={{
                                            height: "30px",
                                            padding: "0 10px",
                                            backgroundColor: "#24ad69",
                                            fontWeight: 500,
                                            marginLeft: "10px"
                                        }}>Памятка по уходу</button>
                                </div>
                            </>}
                            {action.donateSize && <p>Размер доната: {action.donateSize}</p>}
                            {action.comment && <p>Комментарий: {action.comment}</p>}
                        </div>
                    })}
                </div>
            </div>

            {
                user
                && user.userRole === "admin"
                && <div className="container">
                    <h2>Добавить животное</h2>
                    <form id="add-animal-form" onSubmit={(e) => {
                        e.preventDefault();
                        addNewAnimalHandler();
                    }}>
                        <label htmlFor="type">Животное:</label>
                        <select
                            id="type"
                            name="type"
                            required
                            value={getValue('animalType')}
                            onChange={(e) => updValue('animalType', e.target.value)}
                        >
                            <option value="cat">Кошка</option>
                            <option value="dog">Собака</option>
                        </select>

                        <label htmlFor="name">Имя:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={getValue('animalName')}
                            onChange={(e) => updValue('animalName', e.target.value)}
                        />

                        <label htmlFor="breed">Порода:</label>
                        <input
                            type="text"
                            id="breed"
                            name="breed"
                            value={getValue('breed')}
                            onChange={(e) => updValue('breed', e.target.value)}
                        />

                        <label htmlFor="age">Возраст:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            min={0}
                            max={50}
                            value={getValue('age')}
                            onChange={(e) => updValue('age', e.target.value)}
                        />

                        <label htmlFor="image">Фото:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length) {
                                    setAnimalFile(e.target.files.item(0))
                                }
                            }}
                        />

                        <label htmlFor="illness">Болезни:</label>
                        <input
                            type="text"
                            id="illness"
                            name="illness"
                            value={getValue('illness')}
                            onChange={(e) => updValue('illness', e.target.value)}
                        />

                        <label htmlFor="status">Статус:</label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={getValue('status')}
                            onChange={(e) => updValue('status', e.target.value)}
                        >
                            <option value="в приюте">в приюте</option>
                            <option value="усыновлен">усыновлен</option>
                            <option value="передержка">передержка</option>
                        </select>

                        <label htmlFor="description">Описание:</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={getValue('features')}
                            onChange={(e) => updValue('features', e.target.value)}
                        />
                        <button type="submit">Добавить животное</button>
                    </form>
                </div>}
        </section>
    </>
}