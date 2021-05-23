import React from 'react'

export default function SectionBlock({title,description="",children}) {
    return (
        <section className="sectionblock">
            <h2 className="sectionblock__title">{title}</h2>
            <hr className="sectionblock__hr" />
            {description&&<p className="sectionblock__desc">{description}</p>}
            {children}
        </section>
    )
}