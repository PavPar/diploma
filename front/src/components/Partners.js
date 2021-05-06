import React, { useEffect, useState } from 'react';
import Partner from './Partner'

export default function Partners({ partners, handlePartnerSelect }) {


    return (
        <>
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
