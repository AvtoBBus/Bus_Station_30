import { useState } from "react";
import { UserWantAdoptType, UserWantDonateType, UserWantVolunteerType } from "../../shared/DataTypes";

import "./style.css"
import { ConvertKeysNames } from "../../shared/utils/Converters";

export const ActionForm = (props: {
    isModal: boolean,
    model: "adopt" | "donate" | "volunteer",
    submitMethod: Function,
    onClose: Function | null
    title: string
}) => {

    const userInfoInit = {
        name: "",
        phone: "",
        email: "",
        animalType: "cat",
        comment: "",
        donateSize: 0,
    }

    const [userInfo, setUserInfo] = useState<{ [key: string]: any }>(userInfoInit);

    const [response, setResponse] = useState<any | null>(null);

    const getKeys = (): (keyof UserWantAdoptType)[] | (keyof UserWantDonateType)[] | (keyof UserWantVolunteerType)[] | null => {
        if (props.model === "adopt") return Object.keys({ name: "", phone: "", email: "", animalType: "", comment: "" }) as any;
        if (props.model === "donate") return Object.keys({ name: "", phone: "", email: "", donateSize: 0 }) as any;
        if (props.model === "volunteer") return Object.keys({ name: "", phone: "", email: "", comment: "" }) as any;
        return null
    }

    const getValue = (
        propertyName: keyof UserWantAdoptType | keyof UserWantDonateType | keyof UserWantVolunteerType
    ): string | undefined => {
        if (!userInfo || !propertyName || !userInfo.hasOwnProperty(propertyName)) return undefined;
        return userInfo[propertyName]
    }

    const updValue = (
        propertyName: keyof UserWantAdoptType | keyof UserWantDonateType | keyof UserWantVolunteerType,
        value: string | number
    ) => {
        const copy = JSON.parse(JSON.stringify(userInfo));
        if (!userInfo || !propertyName || !userInfo.hasOwnProperty(propertyName)) return;
        copy[propertyName] = value;
        setUserInfo(copy);
    }

    return <>
        <div className="adopt-form-container">
            <h3>{props.title}</h3>
            <form id="adopt-form" onSubmit={(e) => {
                e.preventDefault()
                const keys = getKeys();
                if (keys) {
                    //@ts-ignore
                    const data2Send = keys.reduce((acc: any, key: any) => {
                        Object.assign(acc, { [`${key}`]: userInfo[key] })
                        return acc
                    }, {})
                    props.submitMethod(data2Send)
                        .then((res: any) => {
                            setUserInfo(userInfoInit);
                            setResponse("Спасибо за вашу заявку!")
                        })
                        .catch((err: any) => {
                            setUserInfo(userInfoInit);
                            setResponse("Что-то пошло не так(<br/>Попробуйте позже")
                        })
                }
            }}>

                {/* @ts-ignore */}
                {getKeys()?.map((key: any) => {

                    if (key === "animalType") return <>
                        <label htmlFor={`${props.model}_${key}`}>{ConvertKeysNames[key as keyof typeof ConvertKeysNames]}</label>
                        <select
                            id={`${props.model}_${key}`}
                            name={`${props.model}_${key}`}
                            required
                            value={getValue(key)}
                            onChange={(e) => updValue(key, e.target.value)}
                        >
                            <option value={"cat"}>Кощька</option>
                            <option value={"dog"}>Сабакак</option>
                            <option value={"any"}>Всех</option>
                        </select>
                    </>

                    return <>
                        <label htmlFor={`${props.model}_${key}`}>{ConvertKeysNames[key as keyof typeof ConvertKeysNames]}</label>
                        <input
                            type="text"
                            id={`${props.model}_${key}`}
                            name={`${props.model}_${key}`}
                            required
                            value={getValue(key)}
                            onChange={(e) => updValue(key, e.target.value)}
                        />
                    </>
                })}
                <div className="buttons-container">
                    {props.isModal && <button onClick={() => {
                        props.onClose && props.onClose()
                        setUserInfo(userInfoInit)
                        setResponse(null)
                    }}>Назад</button>}
                    <button type="submit">Отправить заявку</button>
                </div>
                {response && <div id={`adoptMessageText${response.includes("Что-то пошло не так") ? "--error" : ""}`} dangerouslySetInnerHTML={{ __html: response }} />}
            </form>
        </div>
    </>
}