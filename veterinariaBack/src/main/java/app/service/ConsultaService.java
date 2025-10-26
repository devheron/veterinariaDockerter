package app.service;

import app.entity.Consulta;
import app.repository.ConsultaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepository;

    public ConsultaService(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    public List<Consulta> findAll() {
        return consultaRepository.findAll();
    }

    public Consulta findById(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada: " + id));
    }

    public List<Consulta> findByAnimal(Long animalId) {
        // ajuste conforme seu repository
        return consultaRepository.findByAnimalId(animalId);
    }


   public List<Consulta> findByData(LocalDate data) {
        return consultaRepository.findByDataHora(data);
    }

    public Consulta save(Consulta consulta) {
        // (exemplo) status calculado antes de salvar, se for sua regra:
        // consulta.setStatusUrgencia(calculaUrgencia(consulta));
        return consultaRepository.save(consulta);
    }

    public void update(Long id, Consulta consulta) {
        Consulta current = findById(id);
        consulta.setId(current.getId());
        consultaRepository.save(consulta);
    }

    public void deleteById(Long id) {
        if (!consultaRepository.existsById(id)) {
            throw new RuntimeException("Consulta não encontrada: " + id);
        }
        consultaRepository.deleteById(id);
    }
}

