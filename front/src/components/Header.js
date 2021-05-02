import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg'

export default function Header({ type, children, onMenuClick }) {

    return (
        <header className={"header " + type}>
            <Link to="/" className="auth__logo">
                <img src={logo} alt="лого"></img>
            </Link>
            {children}
             
        </header>

    )
}
