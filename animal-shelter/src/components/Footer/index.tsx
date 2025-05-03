import "./style.css"

export const Footer = () => {
    return <>
        <footer className="footer">
            <div className="footer__line"></div>
            <div className="footer__content">
                <div className="footer__left">© 2024, Маслюк А.С., приют "Ушастик"</div>
                <div className="footer__right">По вопросам пишите на <span className="mail">soboring229@gmail.com</span></div>
            </div>
        </footer>
    </>
}