import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxisService } from '../taxis.service';

@Component({
  selector: 'app-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {

  marcasDisponiveis = ['Toyota', 'Mercedes', 'Volkswagen'];
  modelosDisponiveis = ['Prius', 'Classe E', 'Golf'];

  dataInvalida = true;
  novoTaxi: Taxi = {
    _id: null,
    modelo: 'Prius',
    marca: 'Toyota',
    conforto: 'Normal',
    matricula: 'AA-00-AA',
    ano_de_compra: new Date()
  };

  listaTaxis: Taxi[] = [];
  loading = false;
  errorMessage = '';
  constructor(private taxisService: TaxisService) {}

  ngOnInit(): void {
    this.getTaxis();
  }

  getTaxis(): void {
    this.loading = true;
    this.taxisService.getTaxis()
      .subscribe(
        (taxis: Taxi[]) => {
          console.log('Taxis recebidos:', taxis);
          this.listaTaxis = taxis;
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao carregar taxis: ' + error.message;
          this.loading = false;
        }
      );
  }

  registarTaxi() {

    if (!this.validarMatricula(this.novoTaxi.matricula)) {
      console.log('Matrícula inválida!');
      return;
    }

    if (this.validarData()) {
      console.log('Data inválida!');
      return;
    }

    this.formatarData(this.novoTaxi.ano_de_compra);

    // validacoes aqui
    const taxiRegistado = {
      ...this.novoTaxi,
    };

    // adiciona ao topo da lista
    this.listaTaxis.unshift(taxiRegistado);

    this.registarTaxiAux(taxiRegistado);

    this.limparTaxi();
  }

  registarTaxiAux(taxi: Taxi): void {
    this.loading = true;

    this.taxisService.postTaxi(taxi)
      .subscribe(
        (novoTaxi: Taxi) => {
          console.log('Novo taxi adicionado:', novoTaxi);


          this.listaTaxis.unshift(novoTaxi);
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao adicionar novo taxi: ' + error.message;
          this.loading = false;
        }
      );
  }

  validarMatricula(matricula: string): boolean {
    const regex = /^\d{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-\d{2}$|^[A-Za-z]{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-[A-Za-z]{2}$/;

    return regex.test(matricula);
  }

  validarData() {
    const dataInserida = new Date(this.novoTaxi.ano_de_compra);
    const dataAtual = new Date();

    return dataInserida > dataAtual;
  }

  formatarData(data: any): string {
    const dataObj = new Date(data);
    const ano = dataObj.getFullYear();
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dataObj.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  limparTaxi() {
    this.novoTaxi = {
      _id: null,
      modelo: 'Prius',
      marca: 'Toyota',
      conforto: 'Normal',
      matricula: 'AA-00-AA',
      ano_de_compra: new Date()
    };
  }
}
