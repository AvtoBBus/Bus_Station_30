import { useEffect, useRef, useState } from "react"
import { ActionForm } from "../../components/ActionForm"
//@ts-ignore
import VolunteersImg from "../../shared/assets/volunteers.jpg"
import { UserWantDonateType, UserWantVolunteerType } from "../../shared/DataTypes"
import { UserApi } from "../../shared/OpenApi/UserApi"

import "./style.css"

export const DonatePage = () => {

    const [modalContent, setModalContent] = useState<"donate" | "volunteer" | null>(null);
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (modalRef && modalRef.current) {
            if (modalContent) modalRef.current.showModal();
            else modalRef.current.close();
        }
    }, [modalContent])

    return <>

        <dialog
            ref={modalRef}
            style={{ borderRadius: "24px", border: "none" }}
        >
            {modalContent && modalContent === "donate"
                ? <ActionForm
                    isModal={true}
                    model="donate"
                    title="Перечислите сумму, которую не жалко через СБП:"
                    submitMethod={async (formData: UserWantDonateType) => {
                        const userApi = new UserApi();
                        return userApi.sendDonateForm(formData);
                    }}
                    onClose={() => setModalContent(null)}
                />
                : <ActionForm
                    isModal={true}
                    model="volunteer"
                    title="Заполните форму, чтобы стать волонтёром:"
                    submitMethod={async (formData: UserWantVolunteerType) => {
                        const userApi = new UserApi();
                        return userApi.sendVolunteerForm(formData);
                    }}
                    onClose={() => setModalContent(null)}
                />
            }
        </dialog>


        <section className="donate">
            <div className="container">
                <h2>Как помочь приюту "Ушастик"</h2>
                <p className="subtitle">Ваша помощь очень важна для наших питомцев. Вот несколько способов, которыми вы можете нам помочь.</p>

                <div className="help-grid">
                    <div className="help-card">
                        <h3>Пожертвования</h3>
                        <p>Вы можете помочь, сделав пожертвование любым удобным способом:</p>
                        <ul>
                            <li>Деньгами на счёт</li>
                            <li>Кормом для животных</li>
                            <li>Медикаментами</li>
                            <li>Игрушками и амуницией</li>
                        </ul>
                        <div className="help-button-container">
                            <button className="donate-button" onClick={() => setModalContent("donate")}>Сделать пожертвование</button>
                        </div>
                    </div>

                    <div className="help-card">
                        <h3>Волонтёрство</h3>
                        <p>Если у вас есть свободное время, вы можете стать волонтёром в нашем приюте. Мы всегда рады помощи добрых и ответственных людей.</p>
                        <img src={VolunteersImg} alt="Волонтёры с животными" />
                        <div className="help-button-container">
                            <button className="volunteer-button" onClick={() => setModalContent("volunteer")}>Стать волонтёром</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}