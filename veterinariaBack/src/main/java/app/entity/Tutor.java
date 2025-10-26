package app.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do tutor é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF do tutor é obrigatório")
    @Pattern(regexp = "^(\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2})$", message = "O CPF deve estar no formato 000.000.000-00 ou 00000000000")    
    private String cpf;

    @NotBlank(message = "O telefone do tutor é obrigatório")
    private String telefone;

    @OneToMany(mappedBy = "tutor")
    @JsonIgnoreProperties("tutor")
    private List<Animal> animais;
}