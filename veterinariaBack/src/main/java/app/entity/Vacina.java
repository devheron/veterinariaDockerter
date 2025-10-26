package app.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Vacina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da vacina é obrigatório")
    private String nome;

    @NotNull(message = "A data de aplicação é obrigatória")
    private LocalDate dataAplicacao;

    private LocalDate dataProximaDose;

    @NotBlank(message = "O lote da vacina é obrigatório")
    private String lote;

    private String observacoes;

    @ManyToMany(mappedBy = "vacinas")
    @JsonIgnoreProperties("vacinas")
    private List<Animal> animais;

}
