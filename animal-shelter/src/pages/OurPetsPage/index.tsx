import { useContext, useEffect, useState } from "react"
import { AnimalType } from "../../shared/DataTypes"
import "./style.css"
import { PetsContainer } from "../../shared/container/PetsContainer";
import { CardImg } from "../../components/CardImg";
import { PetsApi } from "../../shared/OpenApi/PetsApi";

export const OurPetsPage = (props: { isOpenModal: boolean }) => {

    const [dataList, setDataList] = useState<Array<AnimalType> | null>(null);
    const [selectedType, setSelectedType] = useState<"cat" | "dog">("cat");
    const petsContainer = useContext(PetsContainer);

    useEffect(() => {
        if (!dataList && petsContainer.pets.length === 0) {
            const petsApi = new PetsApi();
            petsApi.getPetsList()
                .then(r => {
                    setDataList(r.filter((pet: AnimalType) => pet.animalType === selectedType))
                })
        }
    }, [])

    useEffect(() => {
        setDataList(petsContainer.pets.filter(pet => pet.animalType === selectedType))
    }, [selectedType])

    console.log({ dataList })

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
                        <CardImg id={data._id} needLoad={Boolean(props.isOpenModal)} />
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
    </>
}