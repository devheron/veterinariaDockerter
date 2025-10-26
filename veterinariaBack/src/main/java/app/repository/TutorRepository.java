package app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.entity.Tutor;

public interface TutorRepository extends JpaRepository<Tutor, Long> {
	
	  @Query("select distinct t from Tutor t left join fetch t.animais")
	    List<Tutor> findAllWithAnimais();

	    @Query("select t from Tutor t left join fetch t.animais where t.id = :id")
	    Optional<Tutor> findByIdWithAnimais(@Param("id") Long id);

    List<Tutor> findByNomeIgnoreCaseContaining(String nome); // Filtra por nome (ignorando maiúsculas/minúsculas)
    List<Tutor> findByCpf(String cpf); // Filtra por CPF

    @Query("SELECT t FROM Tutor t WHERE SIZE(t.animais) > :quantidade")
    List<Tutor> findByQuantidadeAnimaisGreaterThan(@Param("quantidade") int quantidade);
}