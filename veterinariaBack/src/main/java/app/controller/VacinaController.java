package app.controller;

import app.entity.Vacina;
import app.service.VacinaService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vacina")
public class VacinaController {

    private final VacinaService service;

    public VacinaController(VacinaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Vacina>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vacina> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // opcional: por nome
    @GetMapping("/search")
    public ResponseEntity<List<Vacina>> search(@RequestParam String nome) {
        return ResponseEntity.ok(service.findByNome(nome));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> create(@RequestBody Vacina dto) {
        Vacina salvo = service.save(dto);
        URI location = URI.create("/api/vacina/" + salvo.getId());
        return ResponseEntity.created(location).body("Vacina salva com sucesso");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Vacina dto) {
        service.update(id, dto);
        return ResponseEntity.ok("Vacina atualizada com sucesso");
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Vacina excluída com sucesso");
    }
}
