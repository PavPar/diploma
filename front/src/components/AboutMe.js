import React from 'react';

export default function AboutMe({avatar}) {

    return (
        <section className="aboutme" id="aboutme">
            <h2 className="aboutme__header">Студент</h2>
            <div className="aboutme__bio">
                <img className="aboutme__avatar" src={avatar} alt="Аватар"></img>
                <div className="aboutme__info">
                    <h3 className="aboutme__name">Павел</h3>
                    <p className="aboutme__job">Студент, 21 год</p>
                    <p className="aboutme__desc">
                        Пишет 2 диплома одновременно, при этом обладая знаниями картошки.
                </p>
                    <ul className="aboutme__list">
                        <a href="https://github.com/" className="aboutme__link">Github</a>
                        <a href="https://vk.com/thatrussiandude" className="aboutme__link">ВК</a>
                    </ul>
                </div>
            </div>
        </section>
    )
}
