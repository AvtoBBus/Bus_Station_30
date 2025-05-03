
import "./style.css"

export const ContactsPage = () => {
    return <>
        <section className="contacts">
            <div className="container">
                <h2>Наши контакты</h2>
                <p className="subtitle">Свяжитесь с нами, если у вас есть вопросы.</p>

                <div className="contacts-table-container">
                    <table className="contacts-table">
                        <thead>
                            <tr>
                                <th>Город</th>
                                <th>Адрес</th>
                                <th>Телефон</th>
                                <th>Контактное лицо</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Самара</td>
                                <td>ул. Мира, 1</td>
                                <td>+7 (123) 456-7890</td>
                                <td>Анна Иванова</td>
                            </tr>
                            <tr>
                                <td>Москва</td>
                                <td>ул. Пушкина, 2</td>
                                <td>+7 (987) 654-3210</td>
                                <td>Петр Сидоров</td>
                            </tr>
                            <tr>
                                <td>Казань</td>
                                <td>ул. Лесная, 3</td>
                                <td>+7 (555) 123-4567</td>
                                <td>Елена Петрова</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </>
}