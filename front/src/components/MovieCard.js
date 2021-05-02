import React, { useState } from 'react';

export default function MovieCardSaved({ isOwn = false, src, title, duration, alt, saveMovie, deleteMovie, ...props }) {
    const cardData = props.cardData
    const [isSaved, setSaved] = useState(isOwn)
    return (
        <div className="moviecard">
            <img className="moviecard__thumbnail" src={src} alt={alt || "Thumbnail"} draggable="false"></img>
            <div className="moviecard__info">
                <p className="moviecard__title">{title}</p>
                <div className="custom-checkbox">
                    <input onClick={() => {
                        if (isSaved) {
                            deleteMovie(cardData.id)
                                .then(() => {
                                    setSaved(false)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        } else {
                            saveMovie(cardData)
                                .then(() => {
                                    setSaved(true)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    }}
                        className="custom-checkbox__input"
                        type="checkbox"
                        readOnly
                        checked={isSaved}
                    ></input>
                    <div className="custom-checkbox__bubble"></div>
                </div>
                <p className="moviecard__duration">{duration}</p>
            </div>
        </div>

    )
}
