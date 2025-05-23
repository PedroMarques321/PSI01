import { Component } from '@angular/core';
import { TaxisService } from '../taxis.service';
import { DriverService } from '../driver.service';
import { Taxi } from '../taxi';
import { Motorista } from '../motorista';
import { Pessoa, Genero } from '../pessoa';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-gestor',
  standalone: false,
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.scss'
})
export class GestorComponent {

  listaTaxis: Taxi[] = [];
  listaDrivers: Motorista[] = [];

  Genero = Genero;

  loading = false;
  loadingMotoristas = false;
  errorMessage = '';
  erroMotoristas = '';
  mostrarTaxis = false;
  mostrarMotoristas = false;
  mostrarEditorTaxi = false;
  mostrarEditorMotorista = false;
  taxiAEditar: Taxi | null = null;
  motoristaAEditar: Motorista | null = null;

  marcasDisponiveis = ['Toyota', 'Mercedes', 'Volkswagen'];
    todosModelos: { [marca: string]: string[] } = {
      Toyota: ['Prius', 'Corolla', 'Yaris'],
      Mercedes: ['Classe A', 'Classe C', 'Classe E'],
      Volkswagen: ['Golf', 'Passat', 'Tiguan']
    };

  modelosDisponiveis: string[] = [];

  codigosPostais: any[] = [];

  constructor(
      private taxisService: TaxisService,
      private driverService: DriverService
    ) {}

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
              this.listaTaxis = taxis.reverse();
              this.loading = false;
            },
            (error: any) => {
              this.errorMessage = 'Erro ao carregar taxis: ' + error.message;
              this.loading = false;
            }
          );
  }

  getDrivers(): void {
        this.loading = true;
        this.driverService.getDrivers()
          .subscribe(
            (motoristas: Motorista[]) => {
              console.log('Drivers recebidos:', motoristas);
              this.listaDrivers = motoristas.reverse();
              this.loading = false;
            },
            (error: any) => {
              this.errorMessage = 'Erro ao carregar drivers: ' + error.message;
              this.loading = false;
            }
          );
    }

  mostrarLista(): void {
      this.mostrarTaxis = true;
  }

  removerTaxi(taxiID: string): void {
   this.taxisService.removerTaxi(taxiID).subscribe();
   this.getTaxis();
  }

  editarTaxi(taxi: Taxi): void {
     this.taxiAEditar = JSON.parse(JSON.stringify(taxi));
     this.mostrarEditorTaxi = true;
  }

  validarMatricula(matricula: string): boolean {
      const regex = /^\d{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-\d{2}$|^[A-Za-z]{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-[A-Za-z]{2}$/;

      const formatoValido = regex.test(matricula);
      const matriculaExiste = this.listaTaxis.some(taxi => taxi.matricula.toLowerCase() === matricula.toLowerCase());

      return formatoValido && !matriculaExiste;
  }

  validarData(data: Date, anosMinimos: number): boolean {
      const dataInserida = new Date(data);
      const dataAtual = new Date();

      if (anosMinimos === 0) {
        // Verifica que a data não está no futuro
        return dataInserida <= dataAtual;
      } else {
        // Calcula a data mínima aceitável
        const dataMinima = new Date();
        dataMinima.setFullYear(dataAtual.getFullYear() - anosMinimos);

        // Verifica se a data inserida é igual ou anterior à data mínima
        return dataInserida <= dataMinima;
      }
    }

  cancelarEdicao(): void {
    this.taxiAEditar = null;
    this.mostrarEditorTaxi = false;
    }

  guardarEdicao(): void {
    if (!this.taxiAEditar || !this.taxiAEditar._id) return;

    const index = this.listaTaxis.findIndex(t => t._id === this.taxiAEditar!._id);

    if (index !== -1) {
      // Remove o táxi antigo da lista
      this.listaTaxis.splice(index, 1);

      // Insere o táxi atualizado no topo
      this.listaTaxis.unshift(JSON.parse(JSON.stringify(this.taxiAEditar)));

      console.log('Táxi atualizado movido para o topo da lista:', this.listaTaxis[0]);
    } else {
      console.warn('Táxi com este ID não encontrado na lista.');
    }

    // Atualiza no backend
    this.taxisService.updateTaxi(this.taxiAEditar).subscribe();

    this.taxiAEditar = null;
    this.mostrarEditorTaxi = false;
  }

  atualizarModelos(): void {
      this.modelosDisponiveis = this.todosModelos[this.taxiAEditar!.marca] || [];
      this.taxiAEditar!.modelo = '';
    }


  cancelarFormularioMotorista(): void{
    this.motoristaAEditar = null;
    this.mostrarEditorMotorista = false;
    }

  guardarEdicaoMotorista(): void{

    if (!this.motoristaAEditar || !this.motoristaAEditar._id) return;

        const index = this.listaDrivers.findIndex(t => t._id === this.motoristaAEditar!._id);

        if (index !== -1) {
          // Remove o táxi antigo da lista
          this.listaDrivers.splice(index, 1);

          // Insere o táxi atualizado no topo
          this.listaDrivers.unshift(JSON.parse(JSON.stringify(this.motoristaAEditar)));

          console.log('Motorista atualizado movido para o topo da lista:', this.listaDrivers[0]);
        } else {
          console.warn('Motorista com este ID não encontrado na lista.');
        }

    this.driverService.requesitarDriver(this.motoristaAEditar).subscribe();
    this.motoristaAEditar = null;
    this.mostrarEditorMotorista = false;
    }

  removerMotorista(motorista: Motorista): void{
    this.driverService.removerMotorista(motorista!._id!).subscribe();
    this.getDrivers();
    }

  editarMotorista(motorista: Motorista): void{
    this.mostrarEditorMotorista = true;
    this.motoristaAEditar = JSON.parse(JSON.stringify(motorista));
    }

  mostrarListaMotoristas(): void{
    this.mostrarMotoristas = true;
    }

  nifValido(): boolean {
      const nif = String(this.motoristaAEditar!.pessoa.nif);

      // Verifica se contém apenas dígitos
      const formatoValido = /^[0-9]{9}$/.test(nif);

      // Verifica se já existe na lista
      const nifDuplicado = this.listaDrivers.some(driver => String(driver.pessoa.nif) === nif);

      return formatoValido && !nifDuplicado;
    }


    nomeValido(): boolean {
      // Verifica se contém apenas letras (com espaços permitidos)
      return /^[A-Za-zÀ-ÿ\s]+$/.test(this.motoristaAEditar!.pessoa.nome);
    }

    ruaValida(): boolean {
      const ruaRegex = /^[A-Za-zÀ-ÿ\s]+$/;
      return ruaRegex.test(this.motoristaAEditar!.morada.rua);
    }

    portaValida(): boolean {
      return !isNaN(this.motoristaAEditar!.morada.numero_porta);
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
      const codigoPostal = this.motoristaAEditar!.morada.codigo_postal;

      if (codigoPostal.length === 8) {
        const [numCodPostal, extCodPostal] = codigoPostal.split("-");  // Divide o código postal por espaço.
        console.log("Código Postal Inserido:", numCodPostal, extCodPostal);  // Verifique se o valor está correto.
        this.buscarLocalidade(numCodPostal, extCodPostal);  // Chama a função de busca passando ambos os valores
      } else {
        this.motoristaAEditar!.morada.localidade = '';
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
        this.motoristaAEditar!.morada.localidade = encontrado.nome_localidade;
      } else {
        this.motoristaAEditar!.morada.localidade = 'Código postal não encontrado';
      }

      console.log('Localidade encontrada:', this.motoristaAEditar!.morada.localidade);  // Verifique o valor da localidade.
    }
}
