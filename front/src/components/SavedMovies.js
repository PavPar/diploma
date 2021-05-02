import React, { useEffect, useState, useRef } from 'react'

import Header from './Header'
import Footer from './Footer';
import SearchForm from './SearchFrom';
import MovieCardList from './MovieCardList';
import HeaderNav from './HeaderNav'
import InfoTooltip from './InfoTooltip'
import { movieMSG } from '../configs/messages';
import { moviesFilterParameters, localStorageNames } from "../configs/constants";

import logo from '../images/logo.svg'
import MovieCardSaved from './MovieCardSaved';

export default function SavedMovies({ isLoggedIn, getSavedMovies, handleDelete, movies }) {
    const [displayMovies, setDisplayMovies] = useState([])
    const [displayMessage, setDisplayMessage] = useState(false);
    const [displayPreLoader, setPreLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)
    const inputRef = useRef();

    function getDuration(duration = 0) {
        return `${Math.floor(duration / 60)}h${duration % 60}min`
    }

    function nonShortFilmFunction(movie) {
        return movie.duration > moviesFilterParameters.movieLengthThreshold
    }

    useEffect(() => {
        if (localStorage.getItem(localStorageNames.userSavedMoviesSearch)) {
            setDisplayMovies(JSON.parse(localStorage.getItem(localStorageNames.userSavedMoviesSearch)))
        }
    }, [])

    function handleSubmit({ isShortFilm }) {
        const optionalFiltersFunct = []
        if (!isShortFilm) {
            optionalFiltersFunct.push(nonShortFilmFunction)
        }

        if (!inputRef.current.validity.valid) {
            setPopupMessage(movieMSG.noRequestVal)
            setAuthStatus(false)
            setStatusPopupOpen(true)
            console.log("err")
            return;
        }

        const searchReq = inputRef.current.value;
        setDisplayMovies([])
        setDisplayMessage(false)
        setPreLoader(true)

        getSavedMovies()
            .then((data) => {
                data = data.filter((movie) => {
                    let isOk = false
                    const movieName = movie.nameRU || movie.nameEN;
                    if (movieName.toUpperCase().includes(searchReq.toUpperCase())) {
                        isOk = true;
                        optionalFiltersFunct.forEach(filterFunc => {
                            isOk = filterFunc(movie)
                        });
                    }
                    return isOk
                })

                return data
            })
            .then((data) => {
                if (data.length === 0) {
                    setDisplayMessage(true)
                } else {
                    setDisplayMessage(false)
                }
                setDisplayMovies(data)
                localStorage.setItem(localStorageNames.userSavedMoviesSearch, JSON.stringify(data))
            })
            .catch((err) => {
                console.log(err)
                setAuthStatus(false)
                setPopupMessage(movieMSG.unknownErr)
                setStatusPopupOpen(true)
            })
            .finally(() => {
                setPreLoader(false)
            })
    }

    const [StatusPopupOpen, setStatusPopupOpen] = React.useState(false);
    const [isAuthOk, setAuthStatus] = React.useState(false);

    function closeAllPopups() {
        setStatusPopupOpen(false);
    }

    return (
        <>
            <Header src={logo} menu={true}>
                <HeaderNav isLoggedIn={isLoggedIn} />
            </Header>
            <SearchForm
                handleSubmit={handleSubmit}
                inputRef={inputRef}
                onSwitchClick={handleSubmit}
            />
            <MovieCardList
                isMoreBtnVisible={false}
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="moviecardlist__notfound">Ничего не найдено</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="moviecardlist__notfound">Загрузка ...</div>
                {displayMovies.map((movie) => {
                    return <MovieCardSaved
                        key={movie.id}
                        deleteMovie={handleDelete}
                        cardData={movie}
                        title={movie.nameRU || movie.nameEN}
                        src={movie.image}
                        duration={getDuration(movie.duration)}
                    />
                })}

            </MovieCardList>
            <InfoTooltip
                onClose={closeAllPopups}
                isOpen={StatusPopupOpen}
                isOk={isAuthOk}
                msgText={isAuthOk ? movieMSG.ok : popupMessage}
            ></InfoTooltip>
            <Footer></Footer>
        </>
    )
}
