package app.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "A data e hora da consulta são obrigatórias")
    private LocalDateTime dataHora;

    @NotBlank(message = "A descrição da consulta é obrigatória")
    private String descricao;

    private String diagnostico;

    private String tratamento;

    private String observacoes;
    
    private String statusUrgencia;


    @NotBlank(message = "O status da consulta é obrigatório")
    private String status;

    @NotBlank(message = "O tipo da consulta é obrigatório")
    private String tipoConsulta;

    @NotNull(message = "O animal da consulta é obrigatório")
    @ManyToOne
    @JoinColumn(name = "animal_id")
    @JsonIgnoreProperties("consultas")
    private Animal animal;

    @NotNull(message = "O médico da consulta é obrigatório")
    @ManyToOne
    @JoinColumn(name = "medico_id")
    @JsonIgnoreProperties("consultas")
    private Medico medico;
}

