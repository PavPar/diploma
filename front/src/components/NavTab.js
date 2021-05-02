import React from 'react';
import {Link} from 'react-scroll'
export default function NavTab() {

    return (
        <section className="navtab">
            <nav className="navtab__menu">
                <Link to="about" className="nabtab__link">О проекте</Link>
                <Link to="techs" className="nabtab__link">Технологии</Link>
                <Link to="aboutme" className="nabtab__link">Студент</Link>
            </nav>
        </section>
    )
}
