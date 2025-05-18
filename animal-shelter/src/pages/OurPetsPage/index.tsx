import { useContext, useEffect, useState } from "react"
import { AnimalType } from "../../shared/DataTypes"
import "./style.css"
import { PetsContainer } from "../../shared/container/PetsContainer";
import { CardImg } from "../../components/CardImg";
import { PetsApi } from "../../shared/OpenApi/PetsApi";
import { UserContainer } from "../../shared/container/UserContainer";

export const OurPetsPage = (props: { isOpenModal: boolean }) => {

    const [dataList, setDataList] = useState<Array<AnimalType> | null>(null);
    const [selectedType, setSelectedType] = useState<"cat" | "dog">("cat");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editAnimal, setEditAnimal] = useState<AnimalType | null>(null);
    const { pets, setPets } = useContext(PetsContainer);
    const { user } = useContext(UserContainer);

    useEffect(() => {
        if (!dataList && pets.length === 0) {
            const petsApi = new PetsApi();
            petsApi.getPetsList()
                .then(r => {
                    setDataList(r.filter((pet: AnimalType) => pet.animalType === selectedType))
                })
        }
    }, [])

    useEffect(() => {
        setDataList(pets.filter(pet => pet.animalType === selectedType))
    }, [selectedType])

    const deleteAnimalHandler = (animalId: string) => {
        if (user?.userId !== "-1" && user?.userRole === "admin") {
            const api = new PetsApi();
            api.deleteAnimal(animalId)
                .then(r => {
                    api.getPetsList()
                        .then(list => {
                            setPets(list);
                            setDataList(list.filter((pet: AnimalType) => pet.animalType === selectedType));
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
        <div className="buttons-container" style={{ marginTop: "120px" }}>
            <button onClick={() => setSelectedType('cat')}>Кошки</button>
            <button onClick={() => setSelectedType('dog')}>Собаки</button>
        </div>
        <h2 style={{ marginTop: 0 }}>Наши {selectedType === 'dog' ? 'собаки' : 'кошки'}</h2>
        <div className="animal-list">
            {dataList && dataList.map(data => {
                return <>
                    <div className="animal-card">
                        <CardImg id={data._id} needLoad={Boolean(props.isOpenModal) || editMode} />
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
                                ? <input className="text__edit-input" value={editAnimal?.status} onChange={(e) => changeValue("status", e.target.value)} />
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
                                                            setDataList(list.filter((pet: AnimalType) => pet.animalType === selectedType));
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
    </>
}