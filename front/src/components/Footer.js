import React from 'react';

export default function Footer({ marker }) {

    return (
        <footer className="footer">
            <h2 className="footer__title">Учебный проект студента Парамонова Павла</h2>
            <div className="footer__info">
                <div className="footer__year">&#169; 2021</div>
                <ul className="footer__links">
                    <a href="https://github.com/" className="footer__link">Github</a>
                    <a href="https://vk.com/thatrussiandude" className="footer__link">ВК</a>
                </ul>
            </div>
        </footer>
    )
}
