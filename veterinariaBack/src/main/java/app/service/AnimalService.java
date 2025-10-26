package app.service;

import app.entity.Animal;
import app.repository.AnimalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;

    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    @Transactional(readOnly = true)
    public List<Animal> findAll() {
        return animalRepository.findAllWithRelations();
    }

    @Transactional(readOnly = true)
    public Animal findById(Long id) {
        return animalRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado: " + id));
    }


    public List<Animal> findByNome(String nome) {
        // ajuste conforme seu repository
        return animalRepository.findByNomeIgnoreCaseContaining(nome);
    }

    public Animal save(Animal animal) {
        return animalRepository.save(animal);
    }

    public void update(Long id, Animal animal) {
        Animal current = findById(id);
        animal.setId(current.getId());
        animalRepository.save(animal);
    }

    public void deleteById(Long id) {
        if (!animalRepository.existsById(id)) {
            throw new RuntimeException("Animal não encontrado: " + id);
        }
        animalRepository.deleteById(id);
    }
}
