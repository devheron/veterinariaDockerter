package app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.entity.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
	

    @Query("select distinct m from Medico m left join fetch m.consultas left join fetch m.animais")
    List<Medico> findAllWithConsultasAndAnimais();

    @Query("select m from Medico m left join fetch m.consultas left join fetch m.animais where m.id = :id")
    Optional<Medico> findByIdWithConsultasAndAnimais(@Param("id") Long id);

    List<Medico> findByNomeIgnoreCaseContaining(String nome); // Filtra por nome (ignorando maiúsculas/minúsculas)
    List<Medico> findByEspecialidade(String especialidade); // Filtra por especialidade
}