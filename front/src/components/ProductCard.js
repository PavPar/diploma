import React, { useEffect, useRef, useState } from 'react';

export default function MovieCardSaved({ data, image, name, counter=0, handleItemAdd, ...props }) {
    const inputRef = useRef()

    const [itemCounter, setItemCounter] = useState(counter)
    function handleAdd() {
        setItemCounter(1)
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
    return (
        <div className="productcard">
            <img className="productcard__thumbnail" src={image} alt={name}></img>
            <p className="productcard__name">{name}</p>
            <div className="productcard__buttonblock">
                {(() => {
                    if (itemCounter <= 0) {
                        return (<button className="productcard__button productcard__button-type-add" onClick={handleAdd}>+</button>)
                    }
                    else {
                        return (
                            <>
                                <button className="productcard__button productcard__button-type-more" onClick={handleMore}>+</button>
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
                                <button className="productcard__button productcard__button-type-less" onClick={handleLess}>-</button>
                            </>)
                    }
                })()}
            </div>

        </div>

    )
}
