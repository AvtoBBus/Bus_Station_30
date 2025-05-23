import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { HomePage } from './pages/HomePage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AnimalType, User } from './shared/DataTypes';
import { PetsApi } from './shared/OpenApi/PetsApi';
import { PetsContainer } from './shared/container/PetsContainer';
import { OurPetsPage } from './pages/OurPetsPage';
import { DonatePage } from './pages/DonatePage';
import { AdoptPage } from './pages/AdoptPage';
import { ContactsPage } from './pages/ContactPage';
import { UserContainer } from './shared/container/UserContainer';
import { UserApi } from './shared/OpenApi/UserApi';
import { AdminPage } from './pages/AdminPage';
import { validateData } from './shared/utils/HelpFunctions';


export const App = () => {

  const initUser: User = {
    userId: "-1",
    userName: "anonim",
    userRole: "anonim",
    city: "nowhere",
    phone: "unknown",
    email: "unknown",
    userActions: []
  }

  const navigate = useNavigate();

  const [user, setUser] = useState<User>(initUser);
  const [pets, setPets] = useState<Array<AnimalType> | null>(null);

  const [userLogin, setUserLogin] = useState<string>("");
  const [userPass, setUserPass] = useState<string>("");

  const [regLogin, setRegLogin] = useState<string>("");
  const [regPass, setRegPass] = useState<string>("");
  const [regPhone, setRegPhone] = useState<string>("");
  const [regCity, setRegCity] = useState<string>("");
  const [regMail, setRegMail] = useState<string>("");

  const [authError, setLoginError] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const loginRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const petsApi = new PetsApi();

    petsApi.getPetsList()
      .then(r => {
        setPets(r);
      })

    const interval = setInterval(() => {
      petsApi.getPetsList()
        .then(r => {
          setPets(r);
        })
    }, 5000);

    return () => clearInterval(interval);
  }, [])

  const apiCall = () => {
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
      .catch(err => {
        setUser(initUser);
        window.location.pathname.includes("lk") && navigate("/")
      })
  }

  useEffect(() => {

    apiCall();

    const interval = setInterval(() => {
      apiCall();
    }, 5000);

    return () => clearInterval(interval);
  }, [])

  const loginButtonClick = () => {
    if (loginRef && loginRef.current) {
      if (loginRef.current.open) loginRef.current.close();
      else loginRef.current.showModal();
    }
  }

  return <>

    <UserContainer.Provider value={{ user: user, setUser: setUser, forceUpdateUser: apiCall }}>
      <PetsContainer.Provider value={{ pets: pets ? pets : [], setPets: setPets }}>

        <Navigation
          loginButtonClick={loginButtonClick}
          onLogout={() => {
            const userApi = new UserApi();
            userApi.userLogout()
              .then(r => {
                setUser(initUser);
              });
          }}
        />

        <dialog ref={loginRef} style={{ border: "none", borderRadius: "24px", minWidth: "400px", width: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="adopt-form-container">
              <h3>Создать аккаунт</h3>
              <form id="adopt-form" onSubmit={(e) => {
                e.preventDefault();
                const userApi = new UserApi();
                userApi.userRegister({
                  username: regLogin,
                  password: regPass,
                  email: regMail,
                  phone: regPhone,
                  city: regCity,
                })
                  .then(r => {
                    if (r.status >= 400) {
                      setRegError(r);
                    }
                    else {
                      r.json()
                        .then((j: any) => {
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
                      loginButtonClick();
                      setRegLogin("");
                      setRegPass("");
                      setRegMail("");
                      setRegPhone("");
                      setRegCity("");
                    }
                  })
              }}>

                <label htmlFor="userLogin-input">Логин</label>
                <input
                  type="text"
                  id="userLogin-input"
                  name="userLogin-input"
                  required
                  autoComplete="off"
                  value={regLogin}
                  onChange={(e) => setRegLogin(e.target.value)}
                />

                <label htmlFor="userMail-input">Почта</label>
                <input
                  type="email"
                  id="userMail-input"
                  name="userMail-input"
                  required
                  autoComplete="off"
                  value={regMail}
                  onChange={(e) => setRegMail(e.target.value)}
                />

                <label htmlFor="userPhone-input">Номер телефона</label>
                <input
                  type="tel"
                  id="userPhone-input"
                  name="userPhone-input"
                  required
                  autoComplete="off"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />

                <label htmlFor="userCity-input">Город</label>
                <input
                  type="text"
                  id="userCity-input"
                  name="userCity-input"
                  required
                  autoComplete="off"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                />

                <label htmlFor="userPass-input">Пароль</label>
                <input
                  type="password"
                  id="userPass-input"
                  name="userPass-input"
                  required
                  autoComplete="off"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                />

                <div className="buttons-container">
                  <button
                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setRegLogin("");
                      setRegPass("");
                      setRegError(null);
                      loginButtonClick();
                    }}>Назад</button>
                  <button
                    disabled={
                      !validateData(regLogin, "username")
                      || !validateData(regPass, "password")
                      || !validateData(regMail, "email")
                      || !validateData(regPhone, "phone")
                      || !validateData(regCity, "city")
                    }
                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                    type="submit"
                  >Создать</button>
                </div>
                {regError && <>
                  <div id="adoptMessageText--error">Что то пошло не так</div>
                </>}
                {!regError
                  && regPass !== ""
                  && !validateData(regPass, "password")
                  && <div id="adoptMessageText--error">Пароль слишком слабый</div>}
              </form>
            </div>
            <div className="adopt-form-container">
              <h3>Войти в систему</h3>
              <form id="adopt-form" onSubmit={(e) => {
                e.preventDefault();
                const userApi = new UserApi();
                userApi.userAuth({
                  username: userLogin,
                  password: userPass
                })
                  .then(r => {
                    if (r.status >= 400) {
                      setLoginError(r);
                    }
                    else {
                      r.json()
                        .then((j: any) => {
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
                      loginButtonClick();
                      setUserLogin("");
                      setUserPass("");
                    }
                  })
              }}>

                <label htmlFor="userLogin-input">Логин</label>
                <input
                  type="text"
                  id="userLogin-input"
                  name="userLogin-input"
                  required
                  autoComplete="off"
                  value={userLogin}
                  onChange={(e) => setUserLogin(e.target.value)}
                />

                <label htmlFor="userPass-input">Пароль</label>
                <input
                  type="password"
                  id="userPass-input"
                  name="userPass-input"
                  required
                  autoComplete="off"
                  value={userPass}
                  onChange={(e) => setUserPass(e.target.value)}
                />

                <div className="buttons-container">
                  <button
                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserLogin("");
                      setUserPass("");
                      setLoginError(null);
                      loginButtonClick();
                    }}>Назад</button>
                  <button
                    disabled={
                      !validateData(userLogin, "username")
                      || !validateData(userPass, "password")
                    }
                    style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                    type="submit"
                  >Войти</button>
                </div>
                {authError && <>
                  <div id="adoptMessageText--error">Что то пошло не так</div>
                </>}
                {!authError
                  && userPass !== ""
                  && !validateData(userPass, "password")
                  && <div id="adoptMessageText--error">Пароль слишком слабый</div>}
              </form>
            </div>
          </div>
        </dialog>

        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/our-pets" element={<OurPetsPage isOpenModal={Boolean(loginRef.current?.open)} />}></Route>
          <Route path="/donate" element={<DonatePage />}></Route>
          <Route path="/adopt" element={<AdoptPage />}></Route>
          <Route path="/contacts" element={<ContactsPage />}></Route>
          <Route path="/lk" element={<AdminPage />}></Route>
        </Routes>

        <Footer />
      </PetsContainer.Provider >
    </UserContainer.Provider >
  </>
}
