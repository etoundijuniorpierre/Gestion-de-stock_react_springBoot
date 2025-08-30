import React, { useState } from 'react';
import './article.scss';
import { useNavigate } from 'react-router-dom';
import DetailArticle from '../../../components/detail-article/detailArticle';
import ButtonAction from '../../../components/button-action/button';
import Pagination from '../../../components/pagination/pagination';

const Article = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const articles = [1, 2, 3, 4];

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row align-items-center my-3">
        <div className="col-md-8">
          <h1>Liste des articles</h1>
        </div>
        <div className="col-md-4 text-right" >
          <ButtonAction onNouveauClick={() => {
            console.log('🚀 Navigation vers nouvel-article');
            console.log('📍 URL actuelle avant navigation:', window.location.pathname);
            navigate('/dashboard/nouvel-article');
            console.log('🎯 Navigation effectuée');
          }} />
        </div>
      </div>

      {/* Message erreur */}
      {errorMsg && (
        <div className="row mx-3">
          <div className="col-12">
            <div className="alert alert-danger">{errorMsg}</div>
          </div>
        </div>
      )}

      {/* Liste des articles */}
      <div className="row mx-3">
        <div className="col-12" >
          {articles.map((a, i) => (
            <DetailArticle key={i} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="row my-3">
        <div className="col-md-12 text-center">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Article;
