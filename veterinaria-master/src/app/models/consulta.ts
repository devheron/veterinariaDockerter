import { Animal } from "./animal";
import { Medico } from './medico';

export class Consulta {
    id!: number;
    dataHora!: Date;
    descricao!: string;
    diagnostico!: string;
    tratamento!: string;
    observacoes!: string;
    statusUrgencia!: string;
    status!: string;
    tipoConsulta!: string;
    animal!: Animal;
    medico!: Medico;
}