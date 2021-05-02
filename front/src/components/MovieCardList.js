import React from 'react';

export default function MovieCardList({ children, isMoreBtnVisible = true, handleMore }) {

    return (
        <section className="moviecardlist">
            <div className="moviecardlist__grid">
                {children}
            </div>

            {isMoreBtnVisible && (
                <div className="moviecardlist__more">
                    <button className="moviecardlist__btnmore" onClick={handleMore}>Ещё</button>
                </div>
            )}

        </section>
    )
}
