import React, { useState } from 'react';

export default function SearchForm({ handleSubmit, inputRef }) {

    const [isShortFilm, setShortFilmStat] = useState(false)

    return (
        <section className="searchform">
            <form className="searchform__searchbar" noValidate>
                <input className="searchform__input" noValidate placeholder="Фильм" required ref={inputRef}></input>
                <button
                    type="submit"
                    className="searchform__searchbutton"
                    onClick={
                        (event) => {
                            event.preventDefault();
                            handleSubmit({ isShortFilm })
                        }
                    }></button>
            </form>
            <div className="searchform__option">
                <p className="searchform__text">Короткометражки</p>
                <button className="switch">
                    <input
                        className="switch__checkbox"
                        type="checkbox"
                        onClick={() => {
                            setShortFilmStat(!isShortFilm)
                        }}
                         />
                    <div className="switch__bubble"></div>
                </button>
            </div>
            <hr className="searchform__breakline"></hr>
        </section>
    )
}
