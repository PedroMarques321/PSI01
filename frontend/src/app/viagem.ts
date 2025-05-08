export interface Viagem {
  sequencia: number;
  numeroPessoas: number;
  clienteID: string;
  periodo: {
    inicio: Date;
    fim: Date;
  };
  condutorID: string;
  quilometros: number;
  moradaPartida: string;
  moradaChegada: string;
  estado: EstadoPedido;
}

export enum EstadoPedido {
  PENDENTE = 'PENDENTE',
  ACEITE = 'ACEITE',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO'
}