export enum Genero {
  Masculino = true,
  Feminino = false
}

export interface Pessoa {
  nif : string,
  nome : string,
  genero : Genero
}
