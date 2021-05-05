import '../App.css';
import Main from './Main';
import Movies from './Movies';
import Products from './Products';
import Partners from './Partners'
import SavedMovies from './SavedMovies';
import Profile from './Profile';
import Register from './Register';
import Login from './Login'
import ErrorPage from './ErrorPage.js'
import ProtectedRoute from './ProtectedRoute'

import { localStorageNames } from '../configs/constants';

import MainApi from '../utils/MainApi'
import MoviesApi from "../utils/MoviesApi"
import userContext from './context/UserContext';

import { Route, Switch, useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
function App() {
  const [userInfo, setUserInfo] = useState({})

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

  function handleLogout() {
    localStorage.removeItem(localStorageNames.token)
    localStorage.removeItem(localStorageNames.userMoviesSearch)
    localStorage.removeItem(localStorageNames.userSavedMoviesSearch)
    setLoggedIn(false);
  }

  function handlePatch({ name, email }) {
    return MainApi.patchUserInfo({ name, email })
  }

  function handleRegister({ name, email, password }) {
    return MainApi.createUser({ name, email, password })
  }

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


  const [isLoggedIn, setLoggedIn] = useState(() => {
    return handleTokenCheck()
  });

  function nullFixer(value) {
    return (value == null || value == "") ? "неизвестно" : value
  }

  function handleMovieSave(cardData) {
    Object.keys(cardData).forEach(key => {
      cardData[key] = nullFixer(cardData[key]);
    })

    setMovies(movies.filter(movie => {
      if (movie.id === cardData.id) {
        movie.isOwn = true;
      }
      return true;
    }))



    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      id,
    } = cardData


    return MainApi.saveMovie({
      country,
      director,
      duration,
      year,
      description,
      image: image.url,
      trailer: trailerLink,
      nameRU,
      nameEN,
      thumbnail: image.url,
      movieID: id + "",
    })
  }

  function handleMovieDelete(id) {
    return MainApi.deleteMovie(id)
      .then((data) => {
        setMovies(movies.filter(movie => {
          if (movie.id + "" === id + "") {
            movie.isOwn = false;
          }
          return true;
        }))

        if (localStorage.getItem(localStorageNames.userSavedMoviesSearch)) {
          const savedData = JSON.parse(localStorage.getItem(localStorageNames.userSavedMoviesSearch))

          const savedDataRes = savedData.filter(movie => {
            return movie.movieID !== id + ""
          })
          localStorage.setItem(localStorageNames.userSavedMoviesSearch, JSON.stringify(savedDataRes))
        }


        return data
      })
  }

  function getSavedMovies() {
    return MainApi.getSavedMovies()
  }

  const [movies, setMovies] = useState([])

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    Promise.all([
      MoviesApi.getMovies(),
      MainApi.getSavedMovies()
    ])
      .then((data) => {
        const [movies, saved] = data

        const result = movies.filter((movie) => {
          let isOk = true

          if (!movie.image || !movie.duration) {
            return false;
          }

          Object.keys(movie).forEach(key => {
            movie[key] = nullFixer(movie[key]);
          })

          if (movie.image !== null && typeof movie.image === 'object') {
            movie.image.url = MoviesApi.getSyncBaseUrl() + movie.image.url
          } else {
            isOk = false;
          }

          if (saved.find(savedMovie => movie.id + "" === savedMovie.movieID)) {
            movie.isOwn = true;
          }

          return isOk
        })

        setMovies(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [isLoggedIn])

  //=================
  const history = useHistory();

  const [partners, setPartners] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [selectedPartnerData, setPartnerData] = useState({})

  useEffect(() => {
    MainApi.getPartners()
      .then((partnersList) => {
        setPartners(partnersList)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    let partnerData = {}
    if (localStorage.getItem(localStorageNames.selectedPartner)) {
      partnerData = JSON.parse(localStorage.getItem(localStorageNames.selectedPartner))
    }
    Promise.all([MainApi.getProducts(partnerData._id), MainApi.getCategories(partnerData._id)])
      .then((data) => {
        const [products, categories] = data;
        
        setProducts(products)
        setCategories(categories)

        console.log(products)
        console.log(categories)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [selectedPartnerData])

  function handlePartnerSelect(partnerData) {
    localStorage.setItem(localStorageNames.selectedPartner, JSON.stringify(partnerData))
    setPartnerData(partnerData)
    console.log(partnerData)

    history.push('/')
  }

  return (
    <Switch>
      <Route exact path="/">
        <Main isLoggedIn={isLoggedIn}></Main>
      </Route>
      <ProtectedRoute path="/movies" redirectTo="/" loggedIn={isLoggedIn}>
        <Movies
          isLoggedIn={isLoggedIn}
          handleSave={handleMovieSave}
          handleDelete={handleMovieDelete}
          getSavedMovies={getSavedMovies}
          movies={movies}
        />
      </ProtectedRoute>
      <ProtectedRoute path="/partners" redirectTo="/" loggedIn={isLoggedIn}>
        <Partners
          partners={partners}
          handlePartnerSelect={handlePartnerSelect}
        />
      </ProtectedRoute>
      <ProtectedRoute path="/products" redirectTo="/" loggedIn={isLoggedIn}>
        <Products
          partners={partners}
          products={products}
          handlePartnerSelect={handlePartnerSelect}
          categories={categories}
        />
      </ProtectedRoute>
      <ProtectedRoute path="/profile" redirectTo="/" loggedIn={isLoggedIn}>
        <userContext.Provider value={userInfo}>
          <Profile userInfo={userInfo} handleLogout={handleLogout} handlePatch={handlePatch}></Profile>
        </userContext.Provider>
      </ProtectedRoute>
      <ProtectedRoute path="/saved-movies" redirectTo="/" loggedIn={isLoggedIn}>
        <SavedMovies
          isLoggedIn={isLoggedIn}
          getSavedMovies={getSavedMovies}
          handleDelete={handleMovieDelete}
          movies={movies}
        />
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
