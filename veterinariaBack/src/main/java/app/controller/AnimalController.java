package app.controller;

import app.entity.Animal;
import app.service.AnimalService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/animal")
//@CrossOrigin("*")
public class AnimalController {

    private final AnimalService service;

    public AnimalController(AnimalService service) {
        this.service = service;
    }

    @GetMapping("/teste")
    public ResponseEntity<String> teste() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Usuário: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());
        return ResponseEntity.ok("Usuário: " + auth.getName() + " | Authorities: " + auth.getAuthorities());
    }



    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    @GetMapping
    public ResponseEntity<List<Animal>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    @GetMapping("/{id}")
    public ResponseEntity<Animal> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    // opcional: por nome
    @GetMapping("/search")
    public ResponseEntity<List<Animal>> search(@RequestParam String nome) {
        return ResponseEntity.ok(service.findByNome(nome));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> create(@RequestBody Animal dto) {
        Animal salvo = service.save(dto);
        URI location = URI.create("/api/animal/" + salvo.getId());
        return ResponseEntity.created(location).body("Animal salvo com sucesso");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> update(@PathVariable Long id, @RequestBody Animal dto) {
        service.update(id, dto);
        return ResponseEntity.ok("Animal atualizado com sucesso");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER_SISTEMA1')")
    @DeleteMapping(value = "/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Animal excluído com sucesso");
    }
}
