package app.entity;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do animal é obrigatório")
    private String nome;

    @NotBlank(message = "A espécie do animal é obrigatória")
    private String especie;

    @NotBlank(message = "A raça do animal é obrigatória")
    private String raca;

    @NotBlank(message = "A idade do animal é obrigatória")
    private String idade;

    @NotBlank(message = "O peso do animal é obrigatório")
    private String peso;

    @NotNull(message = "O tutor do animal é obrigatório")
    @ManyToOne
    @JoinColumn(name = "tutor_id")
    @JsonIgnoreProperties("animais")
    private Tutor tutor;

    @ManyToMany
    @JoinTable(name = "animal_vacina")
    @JsonIgnoreProperties("animais")
    private List<Vacina> vacinas;

    @OneToMany(mappedBy = "animal")
    @JsonIgnoreProperties("animal")
    private Set<Consulta> consultas = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "animal_medico")
    @JsonIgnoreProperties("animais")
    private Set<Medico> medicos = new HashSet<>();

}