import { Animal } from "./animal";

export class Vacina {
    id!: number;
    nome!: string;
    dataAplicacao!: Date;
    dataProximaDose!: Date;
    lote!: string;
    observacoes!: string;
    animais!: Animal[];
}