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
        getProductsByCategory,
        handleTokenizatorSearch }
) {
    const inputRef = useRef();
    const [parsedProducts, setParsedProducts] = useState([])
    const [displayMessage, setDisplayMessage] = useState(false);
    const [displayPreLoader, setPreLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)
    const [displayProducts, setDisplayProdcuts] = useState([])
    const [displayCategories, setDisplayCategory] = useState(categories);
    const [searchResult, setSearchResult] = useState([])
    const [displayDetectedData, setDetectedData] = useState([])
    const { width } = useWindowDimensions();

    function handleSubmit() {
        if (!inputRef.current.validity.valid) {
            setPopupMessage(movieMSG.noRequestVal)
            setAuthStatus(false)
            setStatusPopupOpen(true)
            console.log("err")
            return;
        }

        handleTokenizatorSearch(inputRef.current.value)
            .then(searchData => {
                console.log(searchData)
                setSearchResult(structSearchData(searchData))
            })
            .catch(err => {
                setPopupMessage(err.msg)
                setAuthStatus(false)
                setStatusPopupOpen(true)
            })
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
                if (searchResult) {
                    products = sortProductsBySearchRes(products, categoryData)
                }
                setDisplayProdcuts(getMoreMovies(products))
                setParsedProducts(products)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function getVendorsFromSearchRes(categoryData) {
        return categoryData.reduce((acc, currVal) => {
            if (currVal.vendor) {
                acc.push(currVal.vendor)
            }
            return acc
        }, [])
    }


    function getAmountFromSearchRes(categoryData) {
        return categoryData.reduce((acc, currVal) => {
            if (currVal.vendor) {
                acc[currVal.vendor.toUpperCase()] = currVal.amount
            }
            return acc
        }, {})
    }

    function sortProductsBySearchRes(data, categoryData) {
        const vendors = getVendorsFromSearchRes(searchResult[categoryData.name])
        const amount = getAmountFromSearchRes(searchResult[categoryData.name])
        const res = []
        console.log(amount)
        //Move items with known vendor first
        data = data.filter(product => {
            if (vendors.find(vendor => vendor.toUpperCase() === product.manufacturer.name.toUpperCase())) {
                if (amount) {
                    product.illusiveCounter = amount[product.manufacturer.name.toUpperCase()];
                    console.log(product)
                }
                res.push(product)
                return false
            } else {
                return true
            }
        })
        res.sort()
        console.log(res)
        return res.concat(data)
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
        //Restore from local storage
        const index = order.findIndex(orderItem => orderItem.data._id === product._id)
        // console.log(index, product)
        if (index >= 0) {
            return order[index].count
        }
        return 0
    }

    function structSearchData(data) {
        const res = {}
        data.forEach(category => {
            const categoryName = Object.keys(category)
            const categoryItemsData = Object.values(category)[0]
            res[categoryName] = categoryItemsData
        });
        return res
    }

    useEffect(() => {
        const searchCategories = Object.keys(searchResult)
        setDetectedData(Object.values(searchResult))
        const filtererdCategories = categories.filter(categoryData => searchCategories.find(searchCategoryName => searchCategoryName.toUpperCase() === categoryData.name.toUpperCase()))
        console.log(categories, filtererdCategories);
        setDisplayCategory(filtererdCategories)
    }, [searchResult])

    return (
        <>
            <SearchForm handleSubmit={handleSubmit} inputRef={inputRef}></SearchForm>
            <div className="detecteddatalist">{displayDetectedData.map(items => {
                return items.map(item => (<div className="detecteddata">
                    <p className="detecteddata__venodor">{item.vendor || "..."}</p>
                    <p className="detecteddata__amount">{item.amount || "..."}</p>
                    <p className="detecteddata__category">{item.category || "..."}</p>
                    <p className="detecteddata__unit">{item.unit || "..."}</p>
                </div>))
                console.log(displayDetectedData)

            })}</div>
            <List
                isMoreBtnVisible={false}
                handleMore={() => {
                    setDisplayProdcuts(displayProducts.concat(getMoreMovies(parsedProducts)))
                }}
                mod="list__grid_mod-categories"
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {displayCategories.map((category) => {
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
                        illusiveCounter={product.illusiveCounter || -1}
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
