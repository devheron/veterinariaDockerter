package app.controller;

import app.entity.Tutor;
import app.service.TutorService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tutor")
public class TutorController {

    private final TutorService service;

    public TutorController(TutorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Tutor>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // opcional: busca por nome
    @GetMapping("/search")
    public ResponseEntity<List<Tutor>> findByNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.findByNome(nome));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> create(@RequestBody Tutor tutor) {
        Tutor salvo = service.save(tutor);
        URI location = URI.create("/api/tutor/" + salvo.getId());
        return ResponseEntity.created(location).body("Tutor salvo com sucesso");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Tutor tutor) {
        service.update(id, tutor);
        return ResponseEntity.ok("Tutor atualizado com sucesso");
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Tutor excluído com sucesso");
    }
}
