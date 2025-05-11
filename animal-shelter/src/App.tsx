import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { HomePage } from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
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


export const App = () => {

  const initUser: User = {
    userId: "-1",
    userName: "anonim",
    userRole: "anonim",
    userActions: []
  }

  const [user, setUser] = useState<User>(initUser);
  const [pets, setPets] = useState<Array<AnimalType> | null>(null);

  const [userLogin, setUserLogin] = useState<string>("");
  const [userPass, setUserPass] = useState<string>("");

  const [authError, setLoginError] = useState<string | null>(null);

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

  useEffect(() => {
    const userApi = new UserApi();

    Promise.all([
      userApi.userInfo(),
      userApi.getUserActions()
    ])
      .then(responses => {
        setUser({
          ...responses[0],
          userActions: responses[1]
        });
      })

    const interval = setInterval(() => {
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

    <UserContainer.Provider value={{ user: user, setUser: setUser }}>
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

        <dialog ref={loginRef} style={{ border: "none", borderRadius: "24px", minWidth: "400px" }}>
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
                  style={{ minWidth: "initial", maxWidth: "170px", width: "fit-content" }}
                  type="submit"
                >Войти</button>
              </div>
              {authError && <>
                <div id="adoptMessageText--error">Что то пошло не так</div>
              </>}
            </form>
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
      </PetsContainer.Provider>
    </UserContainer.Provider>
  </>
}
