import React from 'react';
import Popup from './Popup'
import errLogo from "../images/err.svg";
import okLogo from "../images/suc.svg";

export default function InfoTooltip({ onClose, isOpen, isOk, msgText }) {

    return (

        <Popup
            onClose={onClose}
            isOpen={isOpen}
            name={'message'}
        >
            <img  className="popup__image" src={isOk ? okLogo : errLogo} alt="status"></img>
            <h2 className="popup__title">{msgText}</h2>
        </Popup>
    );
}