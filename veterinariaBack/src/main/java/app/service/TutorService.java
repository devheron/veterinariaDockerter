package app.service;

import app.entity.Tutor;
import app.repository.TutorRepository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorService {

    private final TutorRepository tutorRepository;



    public TutorService(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @Transactional(readOnly = true)
    public List<Tutor> findAll() {
        return tutorRepository.findAllWithAnimais();
    }

    @Transactional(readOnly = true)
    public Tutor findById(Long id) {
        return tutorRepository.findByIdWithAnimais(id)
                .orElseThrow(() -> new RuntimeException("Tutor não encontrado: " + id));
    }

    public List<Tutor> findByNome(String nome) {
        // ajuste o nome do método conforme seu repository
        return tutorRepository.findByNomeIgnoreCaseContaining(nome);
    }

    public Tutor save(Tutor tutor) {
        // validações (se precisar) aqui
        return tutorRepository.save(tutor);
    }

    public void update(Long id, Tutor tutor) {
        // garante que atualiza o correto
        Tutor current = findById(id);
        tutor.setId(current.getId());
        tutorRepository.save(tutor);
    }

    public void deleteById(Long id) {
        if (!tutorRepository.existsById(id)) {
            throw new RuntimeException("Tutor não encontrado: " + id);
        }
        tutorRepository.deleteById(id);
    }
    
    
    
}
