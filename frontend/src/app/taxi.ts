export interface Taxi {
  _id?: string | null,
  modelo : string,
  marca : string,
  conforto: string,
  matricula: string,
  ano_de_compra: Date,
  lugares: number,
  requesitado: boolean,
  usado: boolean
}
