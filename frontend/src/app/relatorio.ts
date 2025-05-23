export interface Relatorio {
    _id: string | null;
    clienteID: string;
    data: Date;
    horaPartida: string;
    horaChegada: string;
    motoristaID: string;
    taxiID: string;
    quilometros: number;
    moradaPartida: string;
    moradaChegada: string;
    preco: number;
    tipoServico: string;
    estado: 'CONCLUIDO';
}
