import '../App.css';
import Main from './Main';
import Products from './Products';
import Partners from './Partners'
import Profile from './Profile';
import Register from './Register';
import Login from './Login'
import ErrorPage from './ErrorPage.js'
import ProtectedRoute from './ProtectedRoute'
import Bill from './Bill'
import Header from './Header';
import HeaderNav from './HeaderNav'
import Footer from './Footer';
import Steps from './Steps';

import { localStorageNames } from '../configs/constants';

import MainApi from '../utils/MainApi'
import userContext from './context/UserContext';

import logo from '../images/logo.svg'

import { Route, Switch, useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
function App() {
  const [userInfo, setUserInfo] = useState({})//Информация о пользователе
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return handleTokenCheck()
  });//Проверка дейстивительности токена

  const history = useHistory();

  const [partners, setPartners] = useState([])//Список магазинов партнеров
  const [categories, setCategories] = useState([])//Категории магазина партнера

  const [selectedPartnerData, setPartnerData] = useState({})//Данные магазина партнера
  const [isPartnerSelected, setPartnerSelected] = useState(true)//Был ли магаизин партнер выбран

  //Автороизация пользователя
  function handleLogin({ email, password }) {
    return MainApi.authUser({ email, password })
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        setLoggedIn(true);
        MainApi.setToken(data.token)
        handleTokenCheck()
        return data;
      })
  }

  //Логоут пользователя
  function handleLogout() {
    localStorage.removeItem(localStorageNames.token)
    localStorage.removeItem(localStorageNames.userMoviesSearch)
    localStorage.removeItem(localStorageNames.userSavedMoviesSearch)
    setLoggedIn(false);
  }

  //Измененение информации о пользователе
  function handlePatch({ name, email }) {
    return MainApi.patchUserInfo({ name, email })
  }

  //Регистрация пользователя
  function handleRegister({ name, email, password }) {
    return MainApi.createUser({ name, email, password })
  }

  //Проверка токена пользователя
  function handleTokenCheck() {
    if (localStorage.getItem(localStorageNames.token)) {
      const jwt = localStorage.getItem(localStorageNames.token);
      MainApi.setToken(jwt)
      return MainApi.checkToken(jwt)
        .then((res) => {
          setUserInfo({
            name: res.name,
            email: res.email
          })
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }
    return false
  }

  //Передача запроса на поиск API 
  function handleTokenizatorSearch(searchReq) {
    return MainApi.tokenizatorSearch(selectedPartnerData._id, searchReq)
  }

  //Произведение выбора партнера
  function handlePartnerSelect(partnerData) {
    localStorage.setItem(localStorageNames.selectedPartner, JSON.stringify(partnerData))
    setPartnerData(partnerData)
    console.log(partnerData)
    setPartnerSelected(true);
    history.push('/order/products')
  }

  //Получение продуктов определенной категории
  function getProductByCategory(categoryData) {
    let partnerData = {}
    if (localStorage.getItem(localStorageNames.selectedPartner)) {
      partnerData = JSON.parse(localStorage.getItem(localStorageNames.selectedPartner))
    }
    return MainApi.getProductByCategory(partnerData._id, categoryData.categoryID[0])
  }

  //Подтверждение заказа
  function handleOrderSubmit(order) {
    console.log(selectedPartnerData)
    return MainApi.sendOrder(selectedPartnerData._id, order)
  }

  function postVoiceRecognition(data){
    return MainApi.postVoiceRecognition(data)
  }

  //Восстановление данных выбранного пратнера
  useEffect(() => {
    if (localStorage.getItem(localStorageNames.selectedPartner)) {
      const partnerData = JSON.parse(localStorage.getItem(localStorageNames.selectedPartner))
      setPartnerData(partnerData)
      setPartnerSelected(true)
      return
    }
    setPartnerSelected(false)
  }, [])

  //Процесс выбора партнера
  useEffect(() => {
    if (!selectedPartnerData) {
      return
    }
    let partnerData = {}
    if (localStorage.getItem(localStorageNames.selectedPartner)) {
      partnerData = JSON.parse(localStorage.getItem(localStorageNames.selectedPartner))
    }
    Promise.all([MainApi.getCategories(partnerData._id)])
      .then((data) => {
        const [categories] = data;

        setCategories(categories)

        console.log(categories)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [selectedPartnerData])


  //Получение списка партнеров
  useEffect(() => {
    MainApi.getPartners()
      .then((partnersList) => {
        setPartners(partnersList)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])


  return (
    <Switch>
      <Route exact path="/">
        <Main isLoggedIn={isLoggedIn}></Main>
      </Route>
      <ProtectedRoute path="/partners" redirectTo="/" controlState={isLoggedIn}>
        <Partners
          partners={partners}
          handlePartnerSelect={handlePartnerSelect}
        />
      </ProtectedRoute>
      <ProtectedRoute path="/order" redirectTo="/" controlState={isLoggedIn}>
        <Header src={logo} menu={true}>
          <HeaderNav isLoggedIn={true} />
        </Header>
        <Steps
          isPartnerSelected={isPartnerSelected}
        />
        <Switch>
          <Route path="/order/partner">
            <Partners
              partners={partners}
              handlePartnerSelect={handlePartnerSelect}
            />
          </Route>
          <ProtectedRoute redirectTo="/order/partner" controlState={isPartnerSelected} path="/order/products">
            <Products
              partners={partners}
              handlePartnerSelect={handlePartnerSelect}
              categories={categories}
              getProductsByCategory={getProductByCategory}
              handleTokenizatorSearch={handleTokenizatorSearch}
              postVoiceRecognition={postVoiceRecognition}
            />
          </ProtectedRoute>
          <ProtectedRoute redirectTo="/order/partner" controlState={isPartnerSelected} path="/order">
            <Bill
              partners={partners}
              handlePartnerSelect={handlePartnerSelect}
              categories={categories}
              getProductsByCategory={getProductByCategory}
              handleOrderSubmit={handleOrderSubmit}
            />
          </ProtectedRoute>
        </Switch>
        <Footer />
      </ProtectedRoute>
      <ProtectedRoute path="/profile" redirectTo="/" controlState={isLoggedIn}>
        <userContext.Provider value={userInfo}>
          <Profile userInfo={userInfo} handleLogout={handleLogout} handlePatch={handlePatch}></Profile>
        </userContext.Provider>
      </ProtectedRoute>
 
      <Route exact path="/signup">
        <Register handleSubmit={handleRegister} handleAuth={handleLogin}></Register>
      </Route>

      <Route exact path="/signin">
        <Login handleSubmit={handleLogin}></Login>
      </Route>
      <ErrorPage code="404" message="Страница не найдена"></ErrorPage>
    </Switch>
  );
}

export default App;
