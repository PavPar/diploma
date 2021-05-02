

import React from 'react';

export default function Techs() {

    return (
        <section className="techs" id="techs">
            <h2 className="techs__header">Технологии</h2>
            <h3 className="techs__title">7 технологий</h3>
            <p className="techs__subtitle">На курсе веб-разработки мы освоили технологии, которые применили в дипломном проекте.</p>
            <ul className="techs__list">
                <li className="techs__tech">HTML</li>
                <li className="techs__tech">CSS</li>
                <li className="techs__tech">JS</li>
                <li className="techs__tech">React</li>
                <li className="techs__tech">Git</li>
                <li className="techs__tech">Express.js</li>
                <li className="techs__tech">mongoDB</li>
            </ul>
        </section>
    )
}
