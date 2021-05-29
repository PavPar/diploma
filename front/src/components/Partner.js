import React from 'react';
export default function Partner({ name, partnerData, handleSelect }, ...props) {
    function handleClick() {
        handleSelect(partnerData)
    }

    return (
        <button className="partner" onClick={handleClick}>
            {name}
        </button>
    )
}
