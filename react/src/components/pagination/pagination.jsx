import React from 'react';
import './pagination.scss';

export default function Pagination({ 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange = () => {},
    showFirstLast = true,
    maxVisiblePages = 5 
}) {
    // Calculer les pages à afficher
    const getVisiblePages = () => {
        const pages = [];
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const hasMultiplePages = totalPages > 1;

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handleFirstPage = () => handlePageClick(1);
    const handlePrevPage = () => handlePageClick(currentPage - 1);
    const handleNextPage = () => handlePageClick(currentPage + 1);
    const handleLastPage = () => handlePageClick(totalPages);

    // Afficher la pagination même avec une seule page pour la cohérence visuelle
    // if (totalPages <= 1) {
    //     return null; // Ne pas afficher la pagination s'il n'y a qu'une page
    // }

    return (
        <div className="pagination" role="group" aria-label="Pagination">
            {showFirstLast && (
                <button 
                    type="button" 
                    className={`pagination__btn pagination__btn--nav ${!hasMultiplePages || isFirstPage ? 'pagination__btn--disabled' : ''}`}
                    onClick={handleFirstPage}
                    disabled={!hasMultiplePages || isFirstPage}
                    aria-label="Première page"
                >
                    <i className="fas fa-angle-double-left"></i>
                </button>
            )}
            
            <button 
                type="button" 
                className={`pagination__btn pagination__btn--nav ${!hasMultiplePages || isFirstPage ? 'pagination__btn--disabled' : ''}`}
                onClick={handlePrevPage}
                disabled={!hasMultiplePages || isFirstPage}
                aria-label="Page précédente"
            >
                <i className="fas fa-angle-left"></i>
            </button>

            {visiblePages.map(page => (
                <button 
                    key={page}
                    type="button" 
                    className={`pagination__btn pagination__btn--page ${page === currentPage ? 'pagination__btn--active' : ''}`}
                    onClick={() => handlePageClick(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            <button 
                type="button" 
                className={`pagination__btn pagination__btn--nav ${!hasMultiplePages || isLastPage ? 'pagination__btn--disabled' : ''}`}
                onClick={handleNextPage}
                disabled={!hasMultiplePages || isLastPage}
                aria-label="Page suivante"
            >
                <i className="fas fa-angle-right"></i>
            </button>
            
            {showFirstLast && (
                <button 
                    type="button" 
                    className={`pagination__btn pagination__btn--nav ${!hasMultiplePages || isLastPage ? 'pagination__btn--disabled' : ''}`}
                    onClick={handleLastPage}
                    disabled={!hasMultiplePages || isLastPage}
                    aria-label="Dernière page"
                >
                    <i className="fas fa-angle-double-right"></i>
                </button>
            )}
        </div>
    )
}