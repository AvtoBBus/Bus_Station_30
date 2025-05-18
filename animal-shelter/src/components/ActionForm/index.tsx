import { useContext, useEffect, useState } from "react";
import { UserWantAdoptType, UserWantDonateType, UserWantVolunteerType } from "../../shared/DataTypes";

import { ConvertKeysNames } from "../../shared/utils/Converters";
import { UserContainer } from "../../shared/container/UserContainer";
import { UserApi } from "../../shared/OpenApi/UserApi";

//@ts-ignore
import QRCode from "../../shared/assets/qrCode.svg"

import "./style.css"
import { validateData } from "../../shared/utils/HelpFunctions";

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

    const { user, setUser } = useContext(UserContainer);

    const [userInfo, setUserInfo] = useState<{ [key: string]: any }>(userInfoInit);

    const [response, setResponse] = useState<any | null>(null);

    const [validateError, setValerror] = useState<string | null>(null);

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
        if (user && user.userId !== "-1" && propertyName === "name") return user.userName;
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

    const validateForm = () => {
        if (!validateData(userInfo.name, "username")) return true;
        if (props.model === 'adopt' || props.model === "volunteer") {
            if (userInfo.phone !== "" && validateData(userInfo.phone, "phone")) {
                if (userInfo.email !== "" && validateData(userInfo.email, "email")) {
                    return false;
                }
            }
        }
        return true;
    }

    useEffect(() => {
        if (props.model === "donate") setTimeout(() => props.onClose && props.onClose(), 5000)
    }, [props.model])

    useEffect(() => {
        if (user?.userId !== "-1") {
            const copy = JSON.parse(JSON.stringify(userInfo));
            copy.name = user?.userName;
            setUserInfo(copy);
        }
    }, [user])

    return <>
        <div className="adopt-form-container">
            <h3 style={{ width: "70%", margin: "0 auto" }}>{props.title}</h3>

            {props.model === "donate"
                ?
                <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <img
                            src={QRCode}
                            alt="qr-code"
                            style={{
                                width: "300px",
                                margin: "0 auto"
                            }}
                        />
                        <button
                            className="button-exit"
                            onClick={() => props.onClose && props.onClose()}
                        >Назад</button>
                    </div>
                </>
                : <form id="adopt-form" onSubmit={(e) => {
                    e.preventDefault()
                    const keys = getKeys();
                    if (keys) {
                        //@ts-ignore
                        const data2Send = keys.reduce((acc: any, key: any) => {
                            Object.assign(acc, { [`${key}`]: userInfo[key] })
                            return acc
                        }, {})

                        if (user && user.userId !== "-1") data2Send.name = user.userName;

                        props.submitMethod(data2Send)
                            .then((res: any) => {
                                setUserInfo(userInfoInit);
                                setResponse("Спасибо за вашу заявку!");
                                const userApi = new UserApi();
                                Promise.all([
                                    userApi.userInfo(),
                                    userApi.getUserActions()
                                ])
                                    .then(responses => {
                                        setUser({
                                            ...responses[0],
                                            userActions: responses[1] ?? []
                                        });
                                    })
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
                                <option value={"cat"}>Кошка</option>
                                <option value={"dog"}>Собака</option>
                                <option value={"any"}>Не определился(-лась)</option>
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
                                disabled={Boolean(user && user.userId !== "-1" && key === "name")}
                                onChange={(e) => updValue(key, e.target.value)}
                            />
                        </>
                    })}
                    <div className="buttons-container">
                        {
                            props.isModal
                            && <button onClick={() => {
                                props.onClose && props.onClose()
                                setUserInfo(userInfoInit)
                                setResponse(null)
                            }}>Назад</button>
                        }
                        <button type="submit" disabled={validateForm()}>Отправить заявку</button>
                    </div>
                    {response && <div id={`adoptMessageText${response.includes("Что-то пошло не так") ? "--error" : ""}`} dangerouslySetInnerHTML={{ __html: response }} />}
                    {!response
                        && userInfo.name !== ""
                        && userInfo.phone !== ""
                        && userInfo.email !== ""
                        && validateForm()
                        && <div id="adoptMessageText--error">Заполните форму корректными данными!</div>}
                </form>
            }


        </div>
    </>
}