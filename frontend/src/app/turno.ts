import { Motorista } from './motorista';
import { Taxi } from './taxi';

export interface Turno {
  dataInicio: Date;
  dataFim: Date;
  motorista:Motorista;
  taxi: Taxi;
}
