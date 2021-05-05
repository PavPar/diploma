import React from 'react';

export default function List({ children, isMoreBtnVisible = true, handleMore,mod="" }) {

    return (
        <section className="list">
            <div  className={`list__grid ${mod}`}>
                {children}
            </div>

            {isMoreBtnVisible && (
                <div className="list__more">
                    <button className="list__btnmore" onClick={handleMore}>Ещё</button>
                </div>
            )}

        </section>
    )
}
