import React, { useEffect } from 'react'
import SearchForm from './SearchFrom';
import List from './List';

import InfoTooltip from './InfoTooltip'
import ProductCard from './ProductCard'
import SectionBlock from './SectionBlock'
import Popup from './Popup';

import { useRef, useState } from 'react';
import { movieMSG } from '../configs/messages';
import { localStorageNames } from "../configs/constants";

export default function Bill({ handleOrderSubmit , handleAlternativeSearch}) {
    const [displayMessage, setDisplayMessage] = useState(false);
    const [displayPreLoader, setPreLoader] = useState(false);
    const [popupMessage, setPopupMessage] = useState(movieMSG.unknownErr)

    const [order, setOrder] = useState(getOrderFromLocalStorage());
    const [displayOrder, setDisplayOrder] = useState(getOrderFromLocalStorage()) // Все продукты отображаемые на экран 
    const [cashedOrder, setCashedOrder] = useState([])

    const [totalPrice, setTotalPrice] = useState(0)

    const [selectedItemData, setSelectedItemData] = useState({});
    const [alternativeItems, setAlternatvie] = useState([])
    const [showItemPopup, setItemPopup] = useState(false);

    function handleSubmit() {
        const orderArr = order.map(product => { return { id: product.data.id, data: product.data, count: product.count } })

        if (orderArr.length == 0) {
            setPopupMessage("Корзина пуста")
            setStatusPopupOpen(true)
            return;
        }

        handleOrderSubmit(orderArr)
            .then(() => {
                setAuthStatus(true)
                setPopupMessage("Заказ оформлен")
                setStatusPopupOpen(true)
                setOrder([])
                setDisplayOrder([])
                localStorage.removeItem(localStorageNames.products)
                setDisplayMessage(true)
                setTotalPrice(0)

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
        if (count > 0) {
            addToOrder({ data, count })
        } else {
            removeFromOrder({ data, count })
        }

        const rawPrice = order.reduce((acc, currval) => {
            return acc + (currval.data.prices.price * currval.count)
        }, 0.0)

        setTotalPrice(Math.round(rawPrice * 100) / 100)
        setDisplayMessage(!order.length > 0)
        if (!order.length > 0) {
            setTotalPrice(0)
            setDisplayOrder([...order])
        }
        console.log(order)
    }

    function parsePrice(num) {
        const values = `${num}`.split('.');
        return `${values[0]} руб. ` + (values[1] ? `${values[1]} коп.` : '');
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

    // Произвести выбор товара с перерисовкой
    function handleItemSelectRender(data, count) {
        if (count > 0) {
            addToOrder({ data, count })
        } else {
            removeFromOrder({ data, count })
        }
        console.log(order)
        setCashedOrder([...order])
        setDisplayOrder([])
    }

    useEffect(() => {
        setDisplayMessage(!order.length > 0)
        if (!order.length > 0) {
            setTotalPrice(0)
            setDisplayOrder([...order])
        }
    }, [order])


    useEffect(() => {
        if (displayOrder.length == 0 && cashedOrder.length !== 0) {
            setDisplayOrder([...cashedOrder])
            setCashedOrder([])
        }
    }, [displayOrder, cashedOrder])

    useEffect(() => {
        if (selectedItemData._id) {
            handleAlternativeSearch(selectedItemData._id)
                .then(res => {
                    console.log("Rec:", res)
                    setAlternatvie(res || [])
                })
                .catch(err => console.log(err))
        }
    }, [selectedItemData])
    
    return (
        <>
            {/* <SearchForm inputRef={inputRef}></SearchForm> */}

            <List
                isMoreBtnVisible={false}
                handleMore={() => { }}
                mod="list__grid_mod-products"
            >
                <div style={displayMessage ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Корзина пуста</div>
                <div style={displayPreLoader ? { "visibility": "visible" } : { "visibility": "hidden" }} className="list__notfound">Загрузка ...</div>
                {displayOrder.map(({ data, count }) => {
                    let product = data
                    return <ProductCard
                        key={product._id}
                        data={product}
                        image={product.images[0]}
                        name={product.name}
                        counter={count}
                        price={product.prices.price}
                        handleItemAdd={handleItemSelect}
                        handleItemSelect={(cardData) => {
                            setSelectedItemData(cardData);
                            setItemPopup(true)
                        }}

                    />
                })}
            </List>
            <InfoTooltip
                onClose={closeAllPopups}
                isOpen={StatusPopupOpen}
                isOk={isAuthOk}
                msgText={isAuthOk ? movieMSG.ok : popupMessage}
            ></InfoTooltip>
            <SectionBlock
                title={`Итого : ${parsePrice(totalPrice)}`}

            >
                <button
                    style={order.length > 0 ? {} : { display: 'none' }}
                    className="confirmorder"
                    onClick={handleSubmit}
                >Подтвердить заказ</button>
            </SectionBlock>
            {
                <Popup
                    name="product"
                    isOpen={showItemPopup}
                    onClose={() => {
                        setSelectedItemData({})
                        setItemPopup(false)
                    }}
                >
                    <SectionBlock
                        mod="sectionblock_mod-product"
                        title={"О товаре"}
                    >
                        {
                            <div className="productinfo">
                                <div className="productinfo__card">
                                    {
                                        selectedItemData._id && (
                                            <ProductCard
                                                key={selectedItemData._id}
                                                data={selectedItemData}
                                                image={selectedItemData.images[0]}
                                                name={selectedItemData.name}
                                                price={selectedItemData.prices.price}
                                                counter={getItemCount(selectedItemData)}
                                                illusiveCounter={selectedItemData.illusiveCounter || -1}
                                                handleItemAdd={handleItemSelectRender}
                                            />
                                        )
                                    }
                                </div>
                                <h2 className="productinfo__title">{selectedItemData.name || ""}</h2>
                                <p className="productinfo__desc">{selectedItemData.description || ""}</p>
                            </div>

                        }
                        {alternativeItems.length > 0 && (<SectionBlock
                            description="С этим товаром также берут"
                        >
                            <List
                                isMoreBtnVisible={false}
                                handleMore={() => {

                                }}
                                mod="list__grid_mod-categories"
                            >
                                {alternativeItems.map((product) => {
                                    return <ProductCard
                                        key={product._id}
                                        data={product}
                                        image={product.images[0]}
                                        name={product.name}
                                        price={product.prices.price}
                                        counter={getItemCount(product)}
                                        illusiveCounter={product.illusiveCounter || -1}
                                        handleItemAdd={handleItemSelect}
                                        handleItemSelect={(cardData) => { setSelectedItemData(cardData) }}
                                        isBtnVisible={false}
                                    />
                                })}
                            </List>
                        </SectionBlock>)}
                    </SectionBlock>

                </Popup>
            }
        </>
    )
}
