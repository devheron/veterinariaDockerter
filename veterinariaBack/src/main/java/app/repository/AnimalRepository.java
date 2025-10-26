package app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.entity.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
	
    @Query("select distinct a from Animal a left join fetch a.consultas left join fetch a.vacinas left join fetch a.medicos left join fetch a.tutor")
    List<Animal> findAllWithRelations();

    @Query("select a from Animal a left join fetch a.consultas left join fetch a.vacinas left join fetch a.medicos left join fetch a.tutor where a.id = :id")
    Optional<Animal> findByIdWithRelations(@Param("id") Long id);

    List<Animal> findByNomeIgnoreCaseContaining(String nome); // Filtra por nome (ignorando maiúsculas/minúsculas)
    List<Animal> findByEspecie(String especie); // Filtra por espécie

    @Query("SELECT a FROM Animal a WHERE a.idade > :idade")
    List<Animal> findByAgeGreaterThan(@Param("idade") String idade); // Filtra animais com idade maior que o valor informado
}