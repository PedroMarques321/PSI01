import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxisService } from '../taxis.service';
import { Driver } from '../driver';
import { DriverService } from '../driver.service';

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

  novoDriver: Driver = {
    _id: null,
    nome: '',
    genero: '',
    nif: '',
    carta_de_conducao: '',
    codigo_postal: '',
    ano_de_nascimento: new Date()
  };

  listaTaxis: Taxi[] = [];
  listaDrivers: Driver[] = [];
  loading = false;
  errorMessage = '';
  constructor(private taxisService: TaxisService, private driverService: DriverService) {}

  ngOnInit(): void {
    this.getTaxis();
    this.getDrivers();
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

  /** Drivers */
  getDrivers(): void {
    this.loading = true;
    this.taxisService.getTaxis()
      .subscribe(
        (drivers: Taxi[]) => {
          console.log('Drivers recebidos:', drivers);
          this.listaTaxis = drivers;
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao carregar drivers: ' + error.message;
          this.loading = false;
        }
      );
  }

  registarDriver() {

    if (this.validarData()) {
      console.log('Data inválida!');
      return;
    }

    this.formatarData(this.novoDriver.ano_de_nascimento);

    // validacoes aqui
    const driverRegistado = {
      ...this.novoDriver,
    };

    // adiciona ao topo da lista
    this.listaDrivers.unshift(driverRegistado);

    this.registarDriverAux(driverRegistado);

    this.limparTaxi();
  }

  registarDriverAux(driver: Driver): void {
    this.loading = true;

    this.driverService.postDriver(driver)
      .subscribe(
        (novoDriver: Driver) => {
          console.log('Novo driver adicionado:', novoDriver);
          this.listaDrivers.unshift(novoDriver);
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao adicionar novo driver: ' + error.message;
          this.loading = false;
        }
      );
    }
}
