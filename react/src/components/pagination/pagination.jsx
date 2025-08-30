import React from 'react';

export default function Pagination() {
    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-light">
                <i className="fas fa-angle-double-left"></i>
            </button>
            <button type="button" className="btn btn-light">
                <i className="fas fa-angle-left"></i>
            </button>


            <button type="button" className="btn btn-light">1</button>
            <button type="button" className="btn btn-light">2</button>
            <button type="button" className="btn btn-light">3</button>
            <button type="button" className="btn btn-light">4</button>
            <button type="button" className="btn btn-light">5</button>
            <button type="button" className="btn btn-light">6</button>


            <button type="button" className="btn btn-light">
                <i className="fas fa-angle-right"></i>
            </button>
            <button type="button" className="btn btn-light">
                <i className="fas fa-angle-double-right"></i>
            </button>
        </div>

    )
}