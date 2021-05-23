import React, { useEffect, useRef, useState } from 'react';

export default function MovieCardSaved({ data, image, name, counter=0, handleItemAdd, illusiveCounter=0,price,...props }) {
    const inputRef = useRef()

    const [itemCounter, setItemCounter] = useState(counter)

    function handleAdd() {
        setItemCounter(illusiveCounter>0?illusiveCounter:1)
    }

    function handleMore() {
        setItemCounter(++inputRef.current.value)
    }

    function handleLess() {
        setItemCounter(--inputRef.current.value)
        if(inputRef.current.value == 0){
            handleItemAdd(data,0)
        }
    }

    function handleChange() {
        setItemCounter(inputRef.current.value)
        if(inputRef.current.value == 0){
            handleItemAdd(data,0)
        }
    }

    useEffect(() => {
        if (itemCounter > 0) {
            handleItemAdd(data, itemCounter)
        }
    }, [itemCounter])

    function parsePrice(num){
        const values = `${num}`.split('.');
        return `${values[0]} руб. ` + (values[1]?`${values[1]} коп.`:'');
    }

    return (
        <div className="productcard">
            <img className="productcard__thumbnail" src={image} alt={name}></img>
            <p className="productcard__name">{name}</p>
            <p className="productcard__price">{parsePrice(price)}</p>
            <div className="productcard__buttonblock">
                {(() => {
                    if (itemCounter <= 0) {
                        return (<button style={illusiveCounter>0?{backgroundColor:"gold"}:{}} className="productcard__button productcard__button-type-add" onClick={handleAdd}>+</button>)
                    }
                    else {
                        return (
                            <>
                                <button className="productcard__button productcard__button-type-less" onClick={handleLess}>-</button>
                                <input
                                    type="text"
                                    className="productcard__counter"
                                    pattern="\d*"
                                    minLength="0"
                                    maxlength="3"
                                    defaultValue={itemCounter}
                                    onBlur={handleChange}
                                    ref={inputRef}
                                />
                                <button className="productcard__button productcard__button-type-more" onClick={handleMore}>+</button>

                            </>)
                    }
                })()}
            </div>

        </div>

    )
}
