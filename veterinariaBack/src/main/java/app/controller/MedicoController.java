package app.controller;

import app.entity.Medico;
import app.service.MedicoService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/medico")
//@CrossOrigin("*")
public class MedicoController {

    private final MedicoService service;

    public MedicoController(MedicoService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    @GetMapping
    public ResponseEntity<List<Medico>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    @GetMapping("/{id}")
    public ResponseEntity<Medico> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    // opcional: por nome/CRM
    @GetMapping("/search")
    public ResponseEntity<List<Medico>> search(@RequestParam(required = false) String nome,
                                               @RequestParam(required = false) String crm) {
        if (nome != null) return ResponseEntity.ok(service.findByNome(nome));
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> create(@RequestBody Medico dto) {
        Medico salvo = service.save(dto);
        URI location = URI.create("/api/medico/" + salvo.getId());
        return ResponseEntity.created(location).body("Médico salvo com sucesso");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Medico dto) {
        service.update(id, dto);
        return ResponseEntity.ok("Médico atualizado com sucesso");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA2')")
    @DeleteMapping(value = "/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Médico excluído com sucesso");
    }
}
