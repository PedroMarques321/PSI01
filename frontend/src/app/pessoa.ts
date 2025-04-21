export enum Genero {
  Masculino = "Masculino",
  Feminino = "Femenino"
}

export interface Pessoa {
  nif : string,
  nome : string,
  genero : Genero
}
