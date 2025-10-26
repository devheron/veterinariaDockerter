package app.controller;

import app.entity.Consulta;
import app.service.ConsultaService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/consulta")
public class ConsultaController {

    private final ConsultaService service;

    public ConsultaController(ConsultaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Consulta>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consulta> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // exemplo de filtro (opcional)
    @GetMapping("/search")
    public ResponseEntity<List<Consulta>> search(@RequestParam(required = false) Long animalId,
                                                 @RequestParam(required = false) Long medicoId,
                                                 @RequestParam(required = false) LocalDate data) {
        if (animalId != null) return ResponseEntity.ok(service.findByAnimal(animalId));
        if (data != null) return ResponseEntity.ok(service.findByData(data));
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> create(@RequestBody Consulta dto) {
        Consulta salvo = service.save(dto);
        URI location = URI.create("/api/consulta/" + salvo.getId());
        return ResponseEntity.created(location).body("Consulta salva com sucesso");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Consulta dto) {
        service.update(id, dto);
        return ResponseEntity.ok("Consulta atualizada com sucesso");
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Consulta excluída com sucesso");
    }
}
