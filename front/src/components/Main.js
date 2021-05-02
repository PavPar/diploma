import React from 'react'

import Header from './Header'
import Promo from './Promo'
import NavTab from './NavTab'
import AboutProject from './AboutProject'
import Techs from './Techs';
import AboutMe from './AboutMe';
import Portfolio from './Portfolio';
import Footer from './Footer';
import HeaderNav from './HeaderNav'

import logo from '../images/logo.svg'
import avatar from '../images/avatar-temp.jpg'
import marker from '../images/link-marker.svg'
export default function Main({ isLoggedIn }) {
    return (
        <>
            <Header type="header_color-blue" src={logo}>
                <HeaderNav isLoggedIn={isLoggedIn} mod={"header__nav_theme-white"} menumod={"menubtn_color-white"}/>
            </Header>
            <Promo></Promo>
            <NavTab></NavTab>
            <AboutProject></AboutProject>
            <Techs></Techs>
            <AboutMe avatar={avatar}></AboutMe>
            <Portfolio marker={marker}></Portfolio>
            <Footer></Footer>
        </>
    )
}
