import React, { useEffect } from 'react'

import SearchForm from './SearchFrom';
import List from './List';
import InfoTooltip from './InfoTooltip'
import ProductCard from './ProductCard'
import CategoryCard from './CategoryCard'

import { useRef, useState } from 'react';
import useWindowDimensions from '../utils/useWindowDimensions'
import { movieMSG } from '../configs/messages';
import { cardsOnWidth, localStorageNames } from "../configs/constants";

export default function Products({ categories = [],getProductsByCategory,handleTokenizatorSearch }) {
    const inputRef = useRef();

    const [parsedProducts, setParsedProducts] = useState([]) // Все продукты полученные из запросы 
    const [order, setOrder] = useState(getOrderFromLocalStorage());//Заказ пользователя

    const [displayProducts, setDisplayProdcuts] = useState([]) // Все продукты отображаемые на экран 
    const [displayProductsPreLoader, setProductsPreloader] = useState(false); // Отображение загрузчика
    const [displayProductsMessage, setProdcutsDisplayMessage] = useState(false); // Отображение сообщения о не найденых

    const [displayCategories, setDisplayCategory] = useState(categories);// Отображаемые категории
    const [displayCategoriesPreLoader, setCategoriesPreloader] = useState(false); // Отображение загрузчика
    const [displayCategoriesMessage, setCategoriesDisplayMessage] = useState(false); // Отображение сообщения о не найденых

    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)//Отображение текста popup
    const [StatusPopupOpen, setStatusPopupOpen] = React.useState(false);//Переключение отображения popup
    const [isPopupStatusOk, setPopupStatus] = React.useState(false);//Изменение значка popup в зависимости от состояния запроса 

    const [searchResult, setSearchResult] = useState([])// Результаты поиска 
    const [displayDetectedData, setDetectedData] = useState([])// Отображаемые результаты поиска (что распозналось) 

    const [showProductsMoreBtn, setShowProductsMoreBtn] = useState(false)//Управление видимостью кнопки больше

    const { width } = useWindowDimensions();

    //Выполнить поиск
    function handleSubmit() {
        if (!inputRef.current.validity.valid) {
            setPopupMessage(movieMSG.noRequestVal)
            setPopupStatus(false)
            setStatusPopupOpen(true)
            console.log("err")
            return;
        }

        handleTokenizatorSearch(inputRef.current.value)
            .then(searchData => {
                console.log(searchData)
                setSearchResult(structSearchData(searchData))
                setDisplayCategory([])
                setDisplayProdcuts([])
            })
            .catch(err => {
                setPopupMessage(err.msg)
                setPopupStatus(false)
                setStatusPopupOpen(true)
            })
    }

    //Определение кол-ва карточек отображаемых в списке
    function getStep(width) {
        const step = Object.keys(cardsOnWidth).filter((x) => x < width).sort((a, b) => b - a)[0];//magic
        return cardsOnWidth[step]
    }

    //Получить больше предметов для отображения
    function getMoreItems(items) {
        return items.splice(0, getStep(width))
    }


    //Закрыть все попапы
    function closeAllPopups() {
        setStatusPopupOpen(false);
    }

    //Получить заказ из хранилища данных
    function getOrderFromLocalStorage() {
        if (!localStorage.getItem(localStorageNames.products)) {
            localStorage.setItem(localStorageNames.products, JSON.stringify([]))
            return []
        } else {
            return JSON.parse(localStorage.getItem(localStorageNames.products))
        }
    }

    //Получение продуктов по категории
    function handleCategorySelect(categoryData) {
        getProductsByCategory(categoryData)
            .then((products) => {
                if (searchResult) {
                    products = sortProductsBySearchRes(products, categoryData)
                }
                setDisplayProdcuts(getMoreItems(products))
                setParsedProducts(products)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // Выделение производителей из результата запроса  
    function getVendorsFromSearchRes(categoryData) {
        return categoryData.reduce((acc, currVal) => {
            if (currVal.vendor) {
                acc.push(currVal.vendor)
            }
            return acc
        }, [])
    }

    // Выделение кол-ва товара из результата запроса
    function getAmountFromSearchRes(categoryData) {
        return categoryData.reduce((acc, currVal) => {
            if (currVal.vendor) {
                acc[currVal.vendor.toUpperCase()] = currVal.amount
            }
            return acc
        }, {})
    }

    // Сортировка продуктов первичная
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

    // Добавить предмет к заказу
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

    // Убрать предмет из заказа
    function removeFromOrder(item) {
        const orderArr = order
        const index = order.findIndex(orderItem => item.data._id === orderItem.data._id)
        if (index >= 0) {
            orderArr.splice(index, 1)
            setOrder(orderArr);
            localStorage.setItem(localStorageNames.products, JSON.stringify(orderArr))
        }
    }

    // Произвести выбор товара
    function handleItemSelect(data, count) {
        console.log(data, count)
        if (count > 0) {
            addToOrder({ data, count })
        } else {
            removeFromOrder({ data, count })
        }
        console.log(order)
    }

    // Получить данные о кол-ве товара
    function getItemCount(product) {
        //Restore from local storage
        const index = order.findIndex(orderItem => orderItem.data._id === product._id)
        // console.log(index, product)
        if (index >= 0) {
            return order[index].count
        }
        return 0
    }

    // Выделение данных категорий и товара из поискового запроса
    function structSearchData(data) {
        const res = {}
        data.forEach(category => {
            const categoryName = Object.keys(category)
            const categoryItemsData = Object.values(category)[0]
            res[categoryName] = categoryItemsData
        });
        return res
    }

    // При получении данных запроса призвести фильтрацию и отобразить полученные данные
    useEffect(() => {
        const searchCategories = Object.keys(searchResult)
        setDetectedData(Object.values(searchResult))
        const filtererdCategories = categories.filter(categoryData => searchCategories.find(searchCategoryName => searchCategoryName.toUpperCase() === categoryData.name.toUpperCase()))
        console.log(categories, filtererdCategories);
        setDisplayCategory(filtererdCategories)
    }, [searchResult])


    //При изменении длина массива показываем/прячем кнопку больше
    useEffect(() => {
        setShowProductsMoreBtn(parsedProducts.length > 0)
    }, [parsedProducts.length])

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

            })}</div>
            <List
                isMoreBtnVisible={false}
                handleMore={() => {
                    setDisplayProdcuts(displayProducts.concat(getMoreItems(parsedProducts)))
                }}
                mod="list__grid_mod-categories"
            >
                <div style={displayProductsMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayProductsPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {displayCategories.map((category) => {
                    return <CategoryCard
                        name={category.name}
                        handleSelect={handleCategorySelect}
                        data={category}
                    />
                })}
            </List>
            <List
                isMoreBtnVisible={showProductsMoreBtn}
                handleMore={() => {
                    setDisplayProdcuts(displayProducts.concat(getMoreItems(parsedProducts)))
                }}
            >
                <div style={displayCategoriesMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayCategoriesPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
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
                isOk={isPopupStatusOk}
                msgText={isPopupStatusOk ? movieMSG.ok : popupMessage}
            ></InfoTooltip>

        </>
    )
}
