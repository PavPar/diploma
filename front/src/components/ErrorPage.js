import React from 'react';
import { useHistory } from 'react-router-dom';

export default function ErrorPage({ code, message }) {
    let history = useHistory();

    const goToPreviousPath = () => {
        if (history.length > 2) {
            history.goBack()
        } else {
            history.push('/')
        }
    }

    return (
        <section className="error">
            <h1 className="error__code">{code}</h1>
            <p className="error__message">{message}</p>
            <button className="error__link" onClick={goToPreviousPath}>Назад</button>
        </section>
    )
}

