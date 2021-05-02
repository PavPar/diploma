import React from 'react';

export default function Portfolio({ marker }) {
    return (
        <section className="portfolio">
            <h2 className="portfolio__header">Портфолио</h2>
            <ul className="link-list">
                <a className="link-list__element" href="https://github.com/yandex-praktikum/how-to-learn">
                    <p className="link-list__text">Статичный сайт</p>
                    <img className="link-list__marker" src={marker} alt="маркер"></img>
                </a>
                <a className="link-list__element" href="https://github.com/PavPar/mesto">
                    <p className="link-list__text">Адаптивный сайт</p>
                    <img className="link-list__marker" src={marker} alt="маркер"></img>
                </a>
                <a className="link-list__element" href="https://github.com/PavPar/react-mesto-auth">
                    <p className="link-list__text">Одностраничное приложение</p>
                    <img className="link-list__marker" src={marker} alt="маркер"></img>
                </a>
            </ul>
        </section>
    )
}
