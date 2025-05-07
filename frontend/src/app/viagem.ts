export interface Viagem {
  sequencia: number;
  numeroPessoas: number;
  clienteIDs: string[];
  periodo: {
    inicio: Date;
    fim: Date;
  };
  quilometros: number;
  moradaPartida: string;
  moradaChegada: string;
}
