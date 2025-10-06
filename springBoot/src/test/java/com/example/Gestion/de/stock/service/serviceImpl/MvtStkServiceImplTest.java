package com.example.Gestion.de.stock.service.serviceImpl;

import com.example.Gestion.de.stock.dto.request.ArticleRequestDto;
import com.example.Gestion.de.stock.dto.request.MvtStkRequestDto;
import com.example.Gestion.de.stock.dto.response.MvtStkResponseDto;
import com.example.Gestion.de.stock.exception.EntityNotFoundException;
import com.example.Gestion.de.stock.exception.InvalidEntityException;
import com.example.Gestion.de.stock.model.entity.Article;
import com.example.Gestion.de.stock.model.entity.MvtStk;
import com.example.Gestion.de.stock.model.enumElem.SourceMvtStk;
import com.example.Gestion.de.stock.model.enumElem.TypeMvtStk;
import com.example.Gestion.de.stock.repository.ArticleRepository;
import com.example.Gestion.de.stock.repository.MvtStkRepository;
import com.example.Gestion.de.stock.service.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MvtStkServiceImplTest {

    @Mock
    private MvtStkRepository repository;

    @Mock
    private ArticleService articleService;

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private MvtStkServiceImpl mvtStkService;

    @Captor
    private ArgumentCaptor<MvtStk> mvtStkCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void correctionStockPos_WithValidArticleId_ShouldSaveMvtStk() {
        // Given
        Integer articleId = 1;
        Article article = new Article();
        article.setId(articleId);

        MvtStkRequestDto dto = MvtStkRequestDto.builder()
                .dateMvt(LocalDate.now())
                .quantite(BigDecimal.TEN)
                .idArticle(articleId)
                .typeMvt(TypeMvtStk.CORRECTION_POS)
                .sourceMvt(SourceMvtStk.COMMANDE_CLIENT)
                .build();

        MvtStk savedMvtStk = new MvtStk();
        savedMvtStk.setId(1);
        savedMvtStk.setArticle(article);
        savedMvtStk.setQuantite(BigDecimal.TEN);
        savedMvtStk.setTypeMvt(TypeMvtStk.CORRECTION_POS);

        when(articleRepository.findById(articleId)).thenReturn(Optional.of(article));
        when(repository.save(any(MvtStk.class))).thenReturn(savedMvtStk);

        // When
        MvtStkResponseDto result = mvtStkService.correctionStockPos(dto);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(articleRepository).findById(articleId);
        verify(repository).save(mvtStkCaptor.capture());

        MvtStk capturedMvtStk = mvtStkCaptor.getValue();
        assertNotNull(capturedMvtStk.getArticle());
        assertEquals(articleId, capturedMvtStk.getArticle().getId());
        assertEquals(BigDecimal.TEN, capturedMvtStk.getQuantite());
        assertEquals(TypeMvtStk.CORRECTION_POS, capturedMvtStk.getTypeMvt());
    }

    @Test
    void correctionStockPos_WithInvalidArticleId_ShouldThrowEntityNotFoundException() {
        // Given
        Integer invalidArticleId = 999;
        MvtStkRequestDto dto = MvtStkRequestDto.builder()
                .dateMvt(LocalDate.now())
                .quantite(BigDecimal.TEN)
                .idArticle(invalidArticleId)
                .typeMvt(TypeMvtStk.CORRECTION_POS)
                .sourceMvt(SourceMvtStk.COMMANDE_CLIENT)
                .build();

        when(articleRepository.findById(invalidArticleId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(EntityNotFoundException.class, () -> mvtStkService.correctionStockPos(dto));
        verify(articleRepository).findById(invalidArticleId);
        verify(repository, never()).save(any(MvtStk.class));
    }

    @Test
    void correctionStockPos_WithNullArticleId_ShouldThrowInvalidEntityException() {
        // Given
        MvtStkRequestDto dto = MvtStkRequestDto.builder()
                .dateMvt(LocalDate.now())
                .quantite(BigDecimal.TEN)
                .idArticle(null)
                .typeMvt(TypeMvtStk.CORRECTION_POS)
                .sourceMvt(SourceMvtStk.COMMANDE_CLIENT)
                .build();

        // When & Then
        assertThrows(InvalidEntityException.class, () -> mvtStkService.correctionStockPos(dto));
        verify(articleRepository, never()).findById(any());
        verify(repository, never()).save(any(MvtStk.class));
    }
}