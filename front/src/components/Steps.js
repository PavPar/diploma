import React from 'react'
import {Link} from "react-router-dom"

export default function Steps({isPartnerSelected}){
    return(
        <section className="steps">
            <Link to="/order/partner"  className={`steps__step steps__step_color-dark ${isPartnerSelected?"steps__step_selected-light":""}`}>Выбор партнера</Link>
            <Link to="/order/products" className="steps__step steps__step_color-normal">Выбор товара</Link>
            <Link to="/order/bill" className="steps__step steps__step_color-light">Подтверждение заказа</Link>
        </section>
    )
}