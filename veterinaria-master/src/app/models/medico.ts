import { Animal } from "./animal";
import { Consulta } from "./consulta";

export class Medico {
    id!: number;
    nome!: string;
    numeroCrm!: string;
    cpf!: string;
    especialidade!: string;
    telefone!: string;
    consultas!: Consulta[];
    animais!: Animal[];
}