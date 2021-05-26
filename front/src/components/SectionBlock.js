import React from 'react'

export default function SectionBlock({title,description="",mod="",children}) {
    return (
        <section className={`sectionblock ${mod}`}>
            <h2 className="sectionblock__title">{title}</h2>
            <hr className="sectionblock__hr" />
            {description&&<p className="sectionblock__desc">{description}</p>}
            {children}
        </section>
    )
}