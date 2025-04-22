export enum Genero {
  Masculino = "Masculino",
  Feminino = "Feminino"
}

export interface Pessoa {
  nif : string,
  nome : string,
  genero : Genero
}
