import { Component } from '@angular/core';
import { Taxi } from '../taxi';
import { TaxisService } from '../taxis.service';
<<<<<<< Updated upstream
import { Driver } from '../driver';
import { DriverService } from '../driver.service';
=======
import * as Papa from 'papaparse';

>>>>>>> Stashed changes

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

  mostrarFormulario: boolean = false;
  mostrarFormularioMotorista = false;
  dataInvalida = true;

  novoTaxi: Taxi = {
    _id: null,
    modelo: 'Prius',
    marca: 'Toyota',
    conforto: 'Normal',
    matricula: 'AA-00-AA',
    ano_de_compra: new Date()
  };

<<<<<<< Updated upstream
  novoDriver: Driver = {
    _id: null,
    nome: '',
    genero: '',
    nif: '',
    carta_de_conducao: '',
    codigo_postal: '',
    ano_de_nascimento: new Date()
=======
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
      nif: 123456789,
      nome: 'João Silva',
      genero: true
    }
>>>>>>> Stashed changes
  };

  listaTaxis: Taxi[] = [];
  listaDrivers: Driver[] = [];
  loading = false;
  errorMessage = '';
<<<<<<< Updated upstream
  constructor(private taxisService: TaxisService, private driverService: DriverService) {}
=======
  constructor(private taxisService: TaxisService) {
    this.carregarCodigosPostais();
  }
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
  //MOTORISTAS---------------------------------------------
  registarMotorista() {
    console.log('Motorista registado:', this.novoMotorista);

    // Aqui podes fazer as validações e o POST usando um service como fizeste com os táxis

    // Limpar formulário
    this.novoMotorista = {
      morada: {
        numero_porta: 0,
        rua: '',
        codigo_postal: '',
        localidade: ''
        },
      carta_de_conducao: '',
      nascimento: new Date(),
      pessoa: {
        nif: 0,
        nome: 'nome',
        genero: true
      }
    };

    this.mostrarFormularioMotorista = false;
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
>>>>>>> Stashed changes
}

