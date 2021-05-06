import React from 'react';
import { Link } from 'react-router-dom'
import accicon from '../images/accicon.svg'
import Navigation from './Navigation';
import { useState } from 'react';

export default function HeaderNav({ isLoggedIn, ...props }) {
    const [isMenuOpen, changeMenuState] = useState(false);

    function handleMenuClick(state) {
        changeMenuState(state);
    }
    if (isLoggedIn) {
        return (
            <>
                <nav className={`header__nav header__nav_adp-menu ${props.mod}`}>
                    <div className="header__menu header__menu_adp-menu">
                        <Link to="/" className="header__button header__element_hidden-lowres">Главная</Link>
                        <Link to="/partners" className="header__button">Магазины</Link>
                        <Link to="/products" className="header__button header__button_decoration-underline">Продукты</Link>
                        
                    </div>

                    <div className="header__menu header__menu_align-right" >
                        <Link to="/profile" className="account-btn">
                            <p className="account-btn__text">Аккаунт</p>
                            <img className="account-btn__marker" src={accicon} alt="аккаунт"></img>
                        </Link >
                    </div>
                    <button class={`menubtn ${props.menumod}`} onClick={handleMenuClick} >
                        <hr class="menubtn__hr"></hr>
                        <hr class="menubtn__hr"></hr>
                        <hr class="menubtn__hr"></hr>
                    </button>
                    {/* <button className="menubtn" onClick={handleMenuClick}> </button> */}
                </nav>
                <Navigation isVisible={isMenuOpen} handleClose={() => handleMenuClick(false)}></Navigation>
            </>
        )
    } else {
        return (
            <nav className="header__nav">
                <div className="header__menu header__menu_align-right">
                    <Link to="/signup" className="header__button header__button_type-signup">Регистрация</Link>
                    <Link to="/signin" className="header__button header__button_type-login">Войти</Link>
                </div>
            </nav>
        )
    }
}
