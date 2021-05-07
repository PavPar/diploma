import React, { useEffect } from 'react'
import SearchForm from './SearchFrom';
import List from './List';

import InfoTooltip from './InfoTooltip'
import ProductCard from './ProductCard'


import { useRef, useState } from 'react';
import { movieMSG } from '../configs/messages';
import { localStorageNames } from "../configs/constants";

import logo from '../images/logo.svg'
import err from '../images/err.svg'
export default function Bill({ handleOrderSubmit }) {
    const inputRef = useRef();
    const [displayMessage, setDisplayMessage] = useState(false);
    const [displayPreLoader, setPreLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)
    const [order, setOrder] = useState(getOrderFromLocalStorage());

    function handleSubmit() {
        const orderArr = order.map(product => { return { id: product.data.id, count: product.count } })
        handleOrderSubmit(orderArr)
            .then(() => {
                setAuthStatus(true)
                setPopupMessage("Заказ оформлен")
                setStatusPopupOpen(true)
                setOrder([])
                localStorage.removeItem(localStorageNames.products)
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


    function getOrderFromLocalStorage() {
        if (!localStorage.getItem(localStorageNames.products)) {
            localStorage.setItem(localStorageNames.products, JSON.stringify([]))
            return []
        } else {
            return JSON.parse(localStorage.getItem(localStorageNames.products))
        }
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
        localStorage.setItem(localStorageNames.products, JSON.stringify(orderArr))
        console.log(order)
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
        if (index >= 0) {
            return order[index].count
        }
        return 0
    }

    return (
        <>
            <SearchForm inputRef={inputRef}></SearchForm>
            <button onClick={handleSubmit}>Подтвердить заказ</button>
            <List
                isMoreBtnVisible={false}
                handleMore={() => { }}
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Ничего не найдено</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {order.map(({ data, count }) => {
                    let product = data
                    return <ProductCard
                        key={product._id}
                        data={product}
                        image={product.images[0]}
                        name={product.name}
                        counter={count}
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
