import React, { useEffect, useState } from 'react';
import Header from './Header';
import HeaderNav from './HeaderNav'
import Partner from './Partner'

export default function Partners({ partners, handlePartnerSelect }) {


    return (
        <>
            <Header menu={true}>
                <HeaderNav isLoggedIn={true} />
            </Header>
            <section className="partnerList">
                {partners.map(partner => {
                    return (
                        <Partner
                            partnerData={partner}
                            name={partner.name}
                            handleSelect={handlePartnerSelect}
                        />
                    )
                })}
            </section>
        </>
    )
}
