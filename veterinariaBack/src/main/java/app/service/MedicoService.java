package app.service;

import app.entity.Medico;
import app.repository.MedicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;

 

    public MedicoService(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    @Transactional(readOnly = true)
    public List<Medico> findAll() {
        return medicoRepository.findAllWithConsultasAndAnimais();
    }

    @Transactional(readOnly = true)
    public Medico findById(Long id) {
        return medicoRepository.findByIdWithConsultasAndAnimais(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado: " + id));
    }


    public List<Medico> findByNome(String nome) {
        // ajuste conforme seu repository
        return medicoRepository.findByNomeIgnoreCaseContaining(nome);
    }


    public Medico save(Medico medico) {
        return medicoRepository.save(medico);
    }

    public void update(Long id, Medico medico) {
        Medico current = findById(id);
        medico.setId(current.getId());
        medicoRepository.save(medico);
    }

    public void deleteById(Long id) {
        if (!medicoRepository.existsById(id)) {
            throw new RuntimeException("Médico não encontrado: " + id);
        }
        medicoRepository.deleteById(id);
    }
}

