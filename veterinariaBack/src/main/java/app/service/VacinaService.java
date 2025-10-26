package app.service;

import app.entity.Vacina;
import app.repository.VacinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VacinaService {

    private final VacinaRepository vacinaRepository;

    public VacinaService(VacinaRepository vacinaRepository) {
        this.vacinaRepository = vacinaRepository;
    }

    public List<Vacina> findAll() {
        return vacinaRepository.findAll();
    }

    public Vacina findById(Long id) {
        return vacinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacina não encontrada: " + id));
    }

    public List<Vacina> findByNome(String nome) {
        // ajuste conforme seu repository
        return vacinaRepository.findByNomeIgnoreCaseContaining(nome);
    }

    public List<Vacina> findByLote(String lote) {
        // ajuste conforme seu repository
        return vacinaRepository.findByLote(lote);
    }

    public Vacina save(Vacina vacina) {
        return vacinaRepository.save(vacina);
    }

    public void update(Long id, Vacina vacina) {
        Vacina current = findById(id);
        vacina.setId(current.getId());
        vacinaRepository.save(vacina);
    }

    public void deleteById(Long id) {
        if (!vacinaRepository.existsById(id)) {
            throw new RuntimeException("Vacina não encontrada: " + id);
        }
        vacinaRepository.deleteById(id);
    }
}

