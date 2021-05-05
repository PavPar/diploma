import React, { useState } from 'react';

export default function MovieCardSaved({ data, image, name, counter, handleAdd, handleRemove, ...props }) {
    return (
        <div className="productcard">
            <img className="productcard__thumbnail" src={image} alt={name}></img>
            <p className="productcard__name">{name}</p>
            <div className="productcard__buttonblock">
                <button className="productcard__button productcard__button-type-more" onClick={handleAdd}>+</button>
                <p className="productcard__counter">{counter}</p>
                <button className="productcard__button productcard__button-type-less" onClick={handleRemove}>-</button>
            </div>

        </div>

    )
}
