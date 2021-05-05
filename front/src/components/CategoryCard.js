import React from 'react';

export default function CategoryCard({ data, image="", name, handleSelect, ...props }) {
    const categoryData = data
    return (
        <button className="categorycard" onClick={()=>{handleSelect(categoryData)}}>
            <img className="categorycard__background" src={image} alt={name}></img>
            <p className="categorycard__name">{name}</p>
        </button>

    )
}
