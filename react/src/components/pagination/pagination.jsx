import React from 'react';
import './pagination.scss';

export default function Pagination() {
    return (
        <div className="pagination" role="group" aria-label="Basic example">
            <button type="button" className="pagination__btn pagination__btn--nav">
                <i className="fas fa-angle-double-left"></i>
            </button>
            <button type="button" className="pagination__btn pagination__btn--nav">
                <i className="fas fa-angle-left"></i>
            </button>

            <button type="button" className="pagination__btn pagination__btn--page">1</button>
            <button type="button" className="pagination__btn pagination__btn--page">2</button>
            <button type="button" className="pagination__btn pagination__btn--page">3</button>
            <button type="button" className="pagination__btn pagination__btn--page">4</button>
            <button type="button" className="pagination__btn pagination__btn--page">5</button>
            <button type="button" className="pagination__btn pagination__btn--page">6</button>

            <button type="button" className="pagination__btn pagination__btn--nav">
                <i className="fas fa-angle-right"></i>
            </button>
            <button type="button" className="pagination__btn pagination__btn--nav">
                <i className="fas fa-angle-double-right"></i>
            </button>
        </div>
    )
}