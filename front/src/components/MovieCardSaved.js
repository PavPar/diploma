import React, { useState } from 'react';

export default function MovieCardSaved({ src, title, duration, deleteMovie, ...props }) {
    const cardData = props.cardData;
    const [isDeleted, setDeleted] = useState(false)
    return (

        <div className="moviecard" style={isDeleted? { "display": 'none' }:{}}>
            <img className="moviecard__thumbnail" src={src} alt="Thumbnail" draggable="false"></img>
            <div className="moviecard__info">
                <p className="moviecard__title">{title}</p>
                <button
                    className="closebtn"
                    onClick={() => {
                        return deleteMovie(cardData.movieID)
                            .then((data) => {
                                setDeleted(true)
                            })
                            .catch((err) => {
                                console.log(err)
                            })

                    }
                    }></button>
                <p className="moviecard__duration">{duration}</p>
            </div>
        </div>

    )
}
