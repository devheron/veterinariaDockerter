package app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.entity.Vacina;

public interface VacinaRepository extends JpaRepository<Vacina, Long> {
	
	@Query("select distinct v from Vacina v left join fetch v.animais")
	List<Vacina> findAllWithAnimais();

	@Query("select v from Vacina v left join fetch v.animais where v.id = :id")
	Optional<Vacina> findByIdWithAnimais(@Param("id") Long id);
	
    List<Vacina> findByNomeIgnoreCaseContaining(String nome); // Filtra por nome (ignorando maiúsculas/minúsculas)
    List<Vacina> findByLote(String lote); // Filtra por lote

}