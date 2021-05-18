import React from 'react'
import {Link} from "react-router-dom"

export default function Steps({isPartnerSelected}){
    return(
        <section className="steps">
            <Link to="/order/partner" style={isPartnerSelected?{backgroundColor:"gray"}:{}} className="steps__step">1. Выбор партнера</Link>
            <Link to="/order/products" className="steps__step">2. Выбор товара</Link>
            <Link to="/order/bill" className="steps__step">3. Подтверждение заказа</Link>
        </section>
    )
}