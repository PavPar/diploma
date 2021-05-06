import React from 'react'
import {Link} from "react-router-dom"

export default function Steps(){
    return(
        <section className="steps">
            <Link to="/order/partner" className="steps__step">1. Выбор партнера</Link>
            <Link to="/order/products" className="steps__step">2. Выбор товара</Link>
            <Link to="/order/bill" className="steps__step">3. Подтеверждение заказа</Link>
        </section>
    )
}