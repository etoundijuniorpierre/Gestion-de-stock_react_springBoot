package com.example.Gestion.de.stock.service.serviceImpl;


import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


import com.example.Gestion.de.stock.dto.mapper.AdresseMapper;
import com.example.Gestion.de.stock.dto.mapper.EntrepriseMapper;
import com.example.Gestion.de.stock.dto.mapper.RolesMapper;
import com.example.Gestion.de.stock.dto.mapper.UtilisateurMapper;
import com.example.Gestion.de.stock.dto.request.EntrepriseRequestDto;
import com.example.Gestion.de.stock.dto.request.UtilisateurRequestDto;
import com.example.Gestion.de.stock.dto.response.EntrepriseResponseDto;
import com.example.Gestion.de.stock.dto.response.RolesResponseDto;
import com.example.Gestion.de.stock.dto.response.UtilisateurResponseDto;
import com.example.Gestion.de.stock.exception.EntityNotFoundException;
import com.example.Gestion.de.stock.exception.ErrorCodes;
import com.example.Gestion.de.stock.exception.InvalidEntityException;
import com.example.Gestion.de.stock.model.entity.Entreprise;
import com.example.Gestion.de.stock.repository.EntrepriseRepository;
import com.example.Gestion.de.stock.repository.RolesRepository;
import com.example.Gestion.de.stock.service.EntrepriseService;
import com.example.Gestion.de.stock.service.UtilisateurService;
import com.example.Gestion.de.stock.validator.EntrepriseValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//@Transactional(rollbackOn = Exception.class)
@Service
@Slf4j
public class EntrepriseServiceImpl implements EntrepriseService {

  private EntrepriseRepository entrepriseRepository;
  private UtilisateurService utilisateurService;
  private RolesRepository rolesRepository;

  @Autowired
  public EntrepriseServiceImpl(EntrepriseRepository entrepriseRepository, UtilisateurService utilisateurService,
      RolesRepository rolesRepository) {
    this.entrepriseRepository = entrepriseRepository;
    this.utilisateurService = utilisateurService;
    this.rolesRepository = rolesRepository;
  }

  @Override
  public EntrepriseResponseDto save(EntrepriseRequestDto dto) {
    List<String> errors = EntrepriseValidator.validate(dto);
    if (!errors.isEmpty()) {
      log.error("Entreprise is not valid {}", dto);
      throw new InvalidEntityException("L'entreprise n'est pas valide", ErrorCodes.ENTREPRISE_NOT_VALID, errors);
    }
    Entreprise entreprise = EntrepriseMapper.toEntity(dto);
    Entreprise savedEntreprise = entrepriseRepository.save(entreprise);
    
    EntrepriseResponseDto savedEntrepriseDto = EntrepriseMapper.fromEntity(savedEntreprise);

    // Create a user for the entreprise
    UtilisateurRequestDto utilisateur = fromEntreprise(savedEntrepriseDto);

    UtilisateurResponseDto savedUser = utilisateurService.save(utilisateur);

    RolesResponseDto rolesDto = RolesResponseDto.builder()
        .roleName("ADMIN")
        .utilisateur(savedUser)
        .build();

    rolesRepository.save(RolesMapper.toEntity(rolesDto));

    return savedEntrepriseDto;
  }

  private UtilisateurRequestDto fromEntreprise(EntrepriseResponseDto dto) {
    return UtilisateurRequestDto.builder()
        .adresse(AdresseMapper.toRequestDto(dto.getAdresse()))
        .nom(dto.getNom())
        .prenom(dto.getCodeFiscal())
        .email(dto.getEmail())
        .motDePasse(generateRandomPassword())
        .entreprise(EntrepriseMapper.toRequestDto(dto))
        .dateDeNaissance(LocalDate.now())
        .photo(dto.getPhoto())
        .build();
  }

  private String generateRandomPassword() {
    return "som3R@nd0mP@$$word";
  }
  @Override
  public EntrepriseResponseDto findById(Integer id) {
    if (id == null) {
      log.error("Entreprise ID is null");
      return null;
    }
    return entrepriseRepository.findById(id)
        .map(EntrepriseMapper::fromEntity)
        .orElseThrow(() -> new EntityNotFoundException(
            "Aucune entreprise avec l'ID = " + id + " n' ete trouve dans la BDD",
            ErrorCodes.ENTREPRISE_NOT_FOUND)
        );
  }

  @Override
  public List<EntrepriseResponseDto> findAll() {
    return entrepriseRepository.findAll().stream()
        .map(EntrepriseMapper::fromEntity)
        .collect(Collectors.toList());
  }

  @Override
  public void delete(Integer id) {
    if (id == null) {
      log.error("Entreprise ID is null");
      return;
    }
    entrepriseRepository.deleteById(id);
  }
}