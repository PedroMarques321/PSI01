import { Pessoa } from './pessoa';
import { Morada } from './morada';

export interface Motorista {
  _id?: string | null,
  morada : Morada,
  carta_de_conducao: string,
  pessoa: Pessoa,
  nascimento: Date,
  requesitado: boolean
}
