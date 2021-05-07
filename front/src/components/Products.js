import React, { useEffect } from 'react'

import Header from './Header'
import Footer from './Footer';
import SearchForm from './SearchFrom';
import List from './List';
import HeaderNav from './HeaderNav'
import InfoTooltip from './InfoTooltip'
import ProductCard from './ProductCard'
import CategoryCard from './CategoryCard'

import { useRef, useState } from 'react';
import useWindowDimensions from '../utils/useWindowDimensions'
import { movieMSG } from '../configs/messages';
import { moviesFilterParameters, cardsOnWidth, localStorageNames } from "../configs/constants";

import err from '../images/err.svg'
export default function Products(
    { isLoggedIn,
        handleSave,
        handleDelete,
        movies = [],
        products = [],
        categories = [],
        getProductsByCategory }
) {
    const inputRef = useRef();
    const [parsedProducts, setParsedProducts] = useState([])
    const [displayMessage, setDisplayMessage] = useState(false);
    const [displayPreLoader, setPreLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)
    const [displayProducts, setDisplayProdcuts] = useState([])
    const [category, setCategory] = useState({});

    const { width } = useWindowDimensions();

    function nonShortFilmFunction(movie) {
        return movie.duration > moviesFilterParameters.movieLengthThreshold;
    }

    function handleSubmit({ isShortFilm }) {
        try {
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
            setPreLoader(true)
            setDisplayProdcuts([])

            const searchReq = inputRef.current.value;

            const data = movies.filter(movie => {
                let isOk = false;
                const movieName = movie.nameRU || movie.nameEN;
                if (movieName.toUpperCase().includes(searchReq.toUpperCase())) {
                    isOk = true;
                    optionalFiltersFunct.forEach(filterFunc => {
                        isOk = filterFunc(movie)
                    });
                }
                return isOk

            })

            if (data.length === 0) {
                setDisplayMessage(true)
            } else {
                setDisplayMessage(false)
            }
            localStorage.setItem(localStorageNames.userMoviesSearch, JSON.stringify(data))
            setDisplayProdcuts(getMoreMovies(data))
            setParsedProducts(data)
        }
        catch {
            console.log(err)
            setAuthStatus(false)
            setPopupMessage(movieMSG.unknownErr)
            setStatusPopupOpen(true)
        }
        finally {
            setPreLoader(false)
        }
    }

    function getStep(width) {
        const step = Object.keys(cardsOnWidth).filter((x) => x < width).sort((a, b) => b - a)[0];//magic
        return cardsOnWidth[step]
    }

    function getMoreMovies(movies) {
        return movies.splice(0, getStep(width))
    }

    const [showMoreBtn, setShowMoreBtn] = useState(false)

    useEffect(() => {
        setShowMoreBtn(parsedProducts.length > 0)
    }, [parsedProducts.length])


    const [StatusPopupOpen, setStatusPopupOpen] = React.useState(false);
    const [isAuthOk, setAuthStatus] = React.useState(false);

    function closeAllPopups() {
        setStatusPopupOpen(false);
    }

    const [order, setOrder] = useState(getOrderFromLocalStorage());

    function getOrderFromLocalStorage() {
        if (!localStorage.getItem(localStorageNames.products)) {
            localStorage.setItem(localStorageNames.products, JSON.stringify([]))
            return []
        } else {
            return JSON.parse(localStorage.getItem(localStorageNames.products))
        }
    }

    function handleCategorySelect(categoryData) {
        getProductsByCategory(categoryData)
            .then((products) => {
                setDisplayProdcuts(getMoreMovies(products))
                setParsedProducts(products)
            })
            .catch((err) => {
                console.log(err)
            })
    }


    function addToOrder(item) {
        const orderArr = order
        const index = order.findIndex(orderItem => item.data._id === orderItem.data._id)
        if (index >= 0) {
            orderArr[index] = item
        } else {
            orderArr.push(item)
        }
        setOrder(orderArr);
        console.log(order)
        //TODO - Move to file 
        localStorage.setItem(localStorageNames.products, JSON.stringify(orderArr))
    }


    function removeFromOrder(item) {
        const orderArr = order
        const index = order.findIndex(orderItem => item.data._id === orderItem.data._id)
        if (index >= 0) {
            orderArr.splice(index, 1)
            setOrder(orderArr);
            localStorage.setItem(localStorageNames.products, JSON.stringify(orderArr))
        }
    }

    function handleItemSelect(data, count) {
        console.log(data, count)
        if (count > 0) {
            addToOrder({ data, count })
        } else {
            removeFromOrder({ data, count })
        }
        console.log(order)
    }


    function getItemCount(product) {
        const index = order.findIndex(orderItem => orderItem.data._id === product._id)
        console.log(index, product)
        if (index >= 0) {
            return order[index].count
        }
        return 0
    }

    return (
        <>
            <SearchForm handleSubmit={handleSubmit} inputRef={inputRef}></SearchForm>
            <List
                isMoreBtnVisible={false}
                handleMore={() => {
                    setDisplayProdcuts(displayProducts.concat(getMoreMovies(parsedProducts)))
                }}
                mod="list__grid_mod-categories"
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {categories.map((category) => {

                    return <CategoryCard
                        name={category.name}
                        handleSelect={handleCategorySelect}
                        data={category}
                    />
                })}
            </List>
            <List
                isMoreBtnVisible={showMoreBtn}
                handleMore={() => {
                    setDisplayProdcuts(displayProducts.concat(getMoreMovies(parsedProducts)))
                }}
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {displayProducts.map((product) => {
                    return <ProductCard
                        key={product._id}
                        data={product}
                        image={product.images[0]}
                        name={product.name}
                        counter={getItemCount(product)}
                        handleItemAdd={handleItemSelect}
                    />
                })}
            </List>
            <InfoTooltip
                onClose={closeAllPopups}
                isOpen={StatusPopupOpen}
                isOk={isAuthOk}
                msgText={isAuthOk ? movieMSG.ok : popupMessage}
            ></InfoTooltip>

        </>
    )
}
