export interface Viagem {
  _id: string | null;
  sequencia: number;
  numeroPessoas: number;
  clienteID: string;
  data: Date;                // Data da viagem
  horaPartida?: string;       // Hora solicitada pelo cliente
  horaChegadaEstimada?: string; // Opcional, estimativa
  condutorID?: string;       // Opcional, preenchido quando aceito
  taxiID?: string;           // Opcional, preenchido quando aceito
  quilometros: number;
  moradaPartida: string;
  moradaChegada: string;
  preco: number;             // Preço estimado ou final
  tipoServico: string;       // 'Normal' ou 'Luxo'
  estado: EstadoPedido;
}

export enum EstadoPedido {
  PENDENTE = 'PENDENTE',
  ACEITE = 'ACEITE',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO'
}