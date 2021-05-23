import React, { useEffect, useState } from 'react';
import Partner from './Partner'
import SectionBlock from './SectionBlock'
export default function Partners({ partners, handlePartnerSelect }) {


    return (
        <SectionBlock
            title="Список доступных партнеров"
            description="Выберите партнера из списка"
        >

            <div className="partnerList">
                {partners.map(partner => {
                    return (
                        <Partner
                            id={partner._id}
                            partnerData={partner}
                            name={partner.name}
                            handleSelect={handlePartnerSelect}
                        />
                    )
                })}
            </div>
        </SectionBlock>
    )
}
