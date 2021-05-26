import React from 'react';

export default function Popup({ name, isOpen, onClose, children, }) {
    function handleClose(e) {
        e.preventDefault();
        onClose();
    }

    return (
        <section 
        style={!isOpen ?{ visibility: "hidden" }:{}} 
        className={`popup ${!isOpen && 'popup_visibility-hidden'} popup-${name}`} 
        >

            <form noValidate
                className={`popup__window popup_type-${name}`}
                name={`popup__window popup_type-${name}`}>

                {children}

                <button
                    className="popup__button popup__button_type_exit"
                    onClick={handleClose}>
                </button>
            </form>
        </section >
    );
}
