import React from 'react';

export default function AboutProject() {

    return (
        <section className="aboutproject" id="about">
            <h2 className="aboutproject__title">О проекте</h2>
            <div className="aboutproject__infoblock">
                <div className="infoblock">
                    <h3 className="infoblock__subtitle">Дипломный проект включал 5 этапов</h3>
                    <p className="infoblock__info">
                        Составление плана, работу над бэкендом,
                        вёрстку, добавление функциональностии финальные доработки.
                </p>
                </div>
                <div className="infoblock">
                    <h3 className="infoblock__subtitle">На выполнение диплома ушло 5 недель</h3>
                    <p className="infoblock__info">У каждого этапа был мягкий и жёсткий дедлайн, которые нужно было соблюдать,
                    чтобы успешно защититься.</p>
                </div>
            </div>
            <div className="aboutproject__process">
                <div className="process">
                    <div className="process__week ">
                        <p className="process__title process__title_color-green">1 неделя</p>
                        <p className="process__info">Back-end</p>
                    </div>
                    <div className="process__week">
                        <p className="process__title process__title_color-gray">4 недели</p>
                        <p className="process__info">Front-end</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
