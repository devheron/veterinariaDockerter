import { Consulta } from "./consulta";
import { Medico } from "./medico";
import { Tutor } from "./tutor";
import { Vacina } from "./vacina";

export class Animal {
    id!: number;
    nome!: string;
    especie!: string;
    raca!: string;
    idade!: string;
    peso!: string;
    tutor!: Tutor;
    vacinas!: Vacina[];
    consultas!: Consulta[];
    medicos!: Medico[];
}