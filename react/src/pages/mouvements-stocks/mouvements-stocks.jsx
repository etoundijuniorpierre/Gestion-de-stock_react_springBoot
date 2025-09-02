import React, { useState } from 'react';
import './mouvements-stocks.scss';
import ButtonAction from '../../components/button-action/button';
import DetailMvtStkArticle from '../../components/detail-mvt-stk-article/detail-mvt-stk-article';
import DetailMvtStk from '../../components/detail-mvt-skt+/detail-mvt-stk';
import Pagination from '../../components/pagination/pagination';

const MouvementsStocks = () => {
  const [collapseStates, setCollapseStates] = useState({
    collapseOne: false,
    collapseTwo: false
  });

  const toggleCollapseOne = () => {
    setCollapseStates(prev => ({
      ...prev,
      collapseOne: !prev.collapseOne
    }));
  };

  const toggleCollapseTwo = () => {
    setCollapseStates(prev => ({
      ...prev,
      collapseTwo: !prev.collapseTwo
    }));
  };

  const getAriaExpandedOne = () => collapseStates.collapseOne;
  const getAriaExpandedTwo = () => collapseStates.collapseTwo;
  const getCollapseOneclassName = () => `collapse ${collapseStates.collapseOne ? 'show' : ''}`;
  const getCollapseTwoclassName = () => `collapse ${collapseStates.collapseTwo ? 'show' : ''}`;

  return (
    <>
      <div className="col mouvements-stocks">
        <div className="row m-3 h-0 p-0 m-0">
          <div className="col-md-8">
            <h1>Mouvements du stock</h1>
          </div>
          <div className="col-md-4 p-0 text-right">
            <ButtonAction
              isImporterVisible={false}
              isNouveauVisible={false}
            />
          </div>
        </div>
        <div className="col">
          <div className="accordion" id="mvtStkDetails">
            <div className="card">
              <div className="card-body" id="headingOne">
                <div className="btn btn-block text-left" 
                  onClick={toggleCollapseOne}
                  aria-expanded={getAriaExpandedOne()} 
                  aria-controls="collapseOne"
                  style={{cursor: 'pointer'}}>
                  <DetailMvtStkArticle />
                </div>
              </div>
              <div id="collapseOne"
                   className={getCollapseOneclassName()}
                   aria-labelledby="headingOne"
                   data-parent="#mvtStkDetails"
                   style={{maxHeight: "300px", overflowY: "scroll"}}>
                <div className="card-body">
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body" id="headingTwo">
                <div className="btn btn-block text-left" 
                  onClick={toggleCollapseTwo}
                  aria-expanded={getAriaExpandedTwo()} 
                  aria-controls="collapseTwo"
                  style={{cursor: 'pointer'}}>
                  <DetailMvtStkArticle />
                </div>
              </div>
              <div id="collapseTwo"
                   className={getCollapseTwoclassName()}
                   aria-labelledby="headingTwo"
                   data-parent="#mvtStkDetails" 
                   style={{maxHeight: "300px", overflowY: "scroll"}}>
                <div className="card-body">
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                  <DetailMvtStk />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className=" col-md-12 text-center">
            <Pagination />
          </div>
        </div>
      </div>
    </>
  );
};

export default MouvementsStocks; 