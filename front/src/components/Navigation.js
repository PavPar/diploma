import React from 'react';
import { Link } from 'react-router-dom';
import accicon from '../images/accicon.svg'

export default function Navigation({ isVisible, handleClose }) {


    return (
        <section className="navigation" style={isVisible? { visibility: "visible" } : { "visibility": "hidden" }}>
            <div className="navigation__links">
                <Link to="/" className="navigation__link">Главная</Link>
                <Link to="/movies" className="navigation__link navigation__link_decoration-underline">Фильмы</Link>
                <Link to="/saved-movies" className="navigation__link">Сохранённые фильмы</Link>
            </div>
            <Link to="/profile" className="account-btn">
                <p className="account-btn__text">Аккаунт</p>
                <img className="account-btn__marker" src={accicon} alt="аккаунт"></img>
            </Link >
            <button className="header__closemenu header__element_hidden-lowres" onClick={handleClose}></button>
        </section>
    )
}
