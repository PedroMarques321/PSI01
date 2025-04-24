import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { Motorista } from '../motorista';
import { Pessoa, Genero } from '../pessoa';
import { Prices } from '../prices';
import { TaxisService } from '../taxis.service';
import { DriverService } from '../driver.service';
import { PricesService } from '../prices.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {

  marcasDisponiveis = ['Toyota', 'Mercedes', 'Volkswagen'];
  modelosDisponiveis = ['Prius', 'Classe E', 'Golf'];
  codigosPostais: any[] = [];

  Genero = Genero;

  mostrarFormulario: boolean = false;
  mostrarFormularioMotorista = false;
  mostrarFormularioPPM = false;
  dataInvalida = true;

  novoTaxi: Taxi = {
    _id: null,
    modelo: 'Prius',
    marca: 'Toyota',
    conforto: 'Normal',
    matricula: 'AA-00-AA',
    ano_de_compra: new Date()
  };

  novoMotorista = {
    morada: {
      numero_porta: 0,
      rua: 'Rua de deus',
      codigo_postal: '',
      localidade: ''
    },
    carta_de_conducao: '',
    nascimento: new Date(),
    pessoa: {
      nif: '123456789',
      nome: 'João Silva',
      genero: Genero.Masculino
    }
  };


  listaTaxis: Taxi[] = [];
  listaDrivers: Motorista[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private taxisService: TaxisService, 
    private driverService: DriverService,
    private pricesService: PricesService
  ) {
    this.carregarCodigosPostais();
  }

  ngOnInit(): void {
    this.getTaxis();
    this.getDrivers();
  }

  //TAXIS-------------------------------------------------------
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

    if (this.validarData(this.novoTaxi.ano_de_compra)) {
      console.log('Data inválida!');
      return;
    }

    this.formatarData(this.novoTaxi.ano_de_compra);


    this.listaTaxis.unshift(this.novoTaxi);

    this.registarTaxiAux(this.novoTaxi);

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

  validarData( data: Date ) {
    const dataInserida = new Date(data);
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

  //MOTORISTAS---------------------------------------------

  getDrivers(): void {
      this.loading = true;
      this.driverService.getDrivers()
        .subscribe(
          (motoristas: Motorista[]) => {
            console.log('Drivers recebidos:', motoristas);
            this.listaDrivers = motoristas;
            this.loading = false;
          },
          (error: any) => {
            this.errorMessage = 'Erro ao carregar drivers: ' + error.message;
            this.loading = false;
          }
        );
  }


  registarMotorista() {
    console.log('Motorista registado:', this.novoMotorista);
    if (!this.nifValido()) {
      console.log('Nif invalido!');
      return;
    }

    if (!this.nomeValido()) {
      console.log('Nome invalido!');
      return;
    }

    if(!this.ruaValida()) {
      console.log('Rua invalida!');
      return;
    }

    if(!this.portaValida()) {
      console.log('Numero de porta invalido');
      return;
    }

    this.listaDrivers.unshift(this.novoMotorista);
    this.registarDriverAux(this.novoMotorista);
    this.limparDriver();
    //this.mostrarFormularioMotorista = false;
  }

  registarDriverAux(motorista: Motorista ): void {
    this.loading = true;

    this.driverService.postDriver(motorista)
      .subscribe(
        (motorista: Motorista) => {
          console.log('Novo driver adicionado:', motorista);


          //this.listaDrivers.unshift(motorista);
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao adicionar novo driver: ' + error.message;
          this.loading = false;
        }
      );

    }

  nifValido(): boolean {
    // Verifica se contém apenas dígitos
    return /^[0-9]+$/.test(String(this.novoMotorista.pessoa.nif));
  }

  nomeValido(): boolean {
    // Verifica se contém apenas letras (com espaços permitidos)
    return /^[A-Za-zÀ-ÿ\s]+$/.test(this.novoMotorista.pessoa.nome);
  }

  ruaValida(): boolean {
    const ruaRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    return ruaRegex.test(this.novoMotorista.morada.rua);
  }

  portaValida(): boolean {
    return !isNaN(this.novoMotorista.morada.numero_porta);
  }

  carregarCodigosPostais() {
    const filePath = 'assets/codigos_postais.csv';

    Papa.parse(filePath, {
      download: true,
      complete: (result : any) => {
        this.codigosPostais = result.data;
        console.log('Dados do CSV carregados:', this.codigosPostais);
      },
      header: true
    });
  }


  onCodigoPostalChange() {
    const codigoPostal = this.novoMotorista.morada.codigo_postal;

    if (codigoPostal.length === 8) {
      const [numCodPostal, extCodPostal] = codigoPostal.split("-");  // Divide o código postal por espaço.
      console.log("Código Postal Inserido:", numCodPostal, extCodPostal);  // Verifique se o valor está correto.
      this.buscarLocalidade(numCodPostal, extCodPostal);  // Chama a função de busca passando ambos os valores
    } else {
      this.novoMotorista.morada.localidade = '';
    }
  }

  buscarLocalidade(numCodPostal: string, extCodPostal: string) {
    console.log('Primeiro elemento do array:', this.codigosPostais[0]);

    const num = numCodPostal.trim();
    const ext = extCodPostal.trim();

    // Encontrar a linha onde num_cod_postal e ext_cod_postal combinam com os valores inseridos.
    const encontrado = this.codigosPostais.find(codigo =>
      codigo.num_cod_postal == numCodPostal && codigo.ext_cod_postal == extCodPostal);

    if (encontrado) {
      this.novoMotorista.morada.localidade = encontrado.nome_localidade;
    } else {
      this.novoMotorista.morada.localidade = 'Código postal não encontrado';
    }

    console.log('Localidade encontrada:', this.novoMotorista.morada.localidade);  // Verifique o valor da localidade.
  }

  limparDriver() {

    this.novoMotorista = {
          morada: {
            numero_porta: 0,
            rua: 'rua',
            codigo_postal: 'xxxx-xxx',
            localidade: ''
          },
          carta_de_conducao: '',
          nascimento: new Date(),
          pessoa: {
            nif: '0',
            nome: 'nome',
            genero: Genero.Masculino
          }
    }
  }


  /** PREÇOS */

  precos: Prices = {
    taxa_normal: 0.20,
    taxa_luxo: 0.30,
    acrescimo_noturno: 10
  };

  registarPrecos() {
    console.log('A atualizar os preços');

    this.pricesService.updatePrices(this.precos)
      .subscribe(
        (newPrices: Prices) => {
          console.log('Preços atualizados:', newPrices);
        },
        (error: any) => {
          this.errorMessage = 'Erro ao atualizar preços: ' + error.message;
        }
      );
  }
}
