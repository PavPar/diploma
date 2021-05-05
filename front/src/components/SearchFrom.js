import React, { useState } from 'react';

export default function SearchForm({ handleSubmit, inputRef }) {

    const [isShortFilm, setShortFilmStat] = useState(false)

    return (
        <section className="searchform">
            <form className="searchform__searchbar" noValidate>
                <input className="searchform__input" noValidate placeholder="Поиск" required ref={inputRef}></input>
                <button
                    type="submit"
                    className="searchform__searchbutton"
                    onClick={
                        (event) => {
                            event.preventDefault();
                            handleSubmit({ isShortFilm:false })
                        }
                    }></button>
            </form>
        
            <hr className="searchform__breakline"></hr>
        </section>
    )
}
