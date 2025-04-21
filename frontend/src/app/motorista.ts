import { Pessoa } from './pessoa';
import { Morada } from './morada';

export interface Motorista {
  morada : Morada,
  carta_de_conducao: string,
  pessoa: Pessoa,
  nascimento: Date,
}
