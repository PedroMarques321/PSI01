import { Component } from '@angular/core';
import { TaxisService } from '../taxis.service';
import { DriverService } from '../driver.service';
import { TurnosService } from '../turnos.service';
import { Pessoa, Genero } from '../pessoa';
import { Motorista } from '../motorista';
import { Taxi } from '../taxi';
import { Turno } from '../turno';

@Component({
  selector: 'app-motorista',
  standalone: false,
  templateUrl: './motorista.component.html',
  styleUrl: './motorista.component.scss'
})
export class MotoristaComponent {

  listaDrivers: Motorista[] = [];
  listaTaxis: Taxi[] = [];
  listaTurnos: Turno[] = [];
  loading = false;
  errorMessage = '';
  dataInicioStr: string = '';
  dataFimStr: string = '';

  turno: Turno = {
      dataInicio: new Date(),
      dataFim: new Date(),
      motorista: {} as Motorista,
      taxi: {} as Taxi
    };

  nifSelecionado: string = '';
  motoristaLogado: Motorista | null = null;
  loginConfirmado: boolean = false;
  erroNif: boolean = false;

  constructor(
    private taxisService: TaxisService,
    private  driverService: DriverService,
    private turnosService: TurnosService
  ) {}

  confirmarLogin() {
    const motorista = this.listaDrivers.find(m => m.pessoa.nif === this.nifSelecionado);

     if (motorista && this.nifValido()) {
       this.motoristaLogado = motorista;
       this.loginConfirmado = true;
       this.erroNif = false;
     } else {
       this.erroNif = true;
     }
   }

   onSelectNif(event: any) {
     this.nifSelecionado = event.target.value;
     this.erroNif = false;
   }

  ngOnInit(): void {
      this.getTaxis();
      this.getDrivers();
      this.getTurnos();
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

  getTurnos(): void {
    this.loading = true;
    this.turnosService.getTurnos()  // Chama o serviço para obter os turnos
      .subscribe(
        (turnos: Turno[]) => {
          console.log('Turnos recebidos:', turnos);
          this.listaTurnos = turnos.reverse();  // Armazena os turnos na lista
          this.loading = false;
        },
        (error: any) => {
          this.errorMessage = 'Erro ao carregar turnos: ' + error.message;
          this.loading = false;
        }
      );
  }

  nifValido(): boolean {
      // Verifica se contém apenas dígitos
      const formatoValido = /^[0-9]{9}$/.test(this.nifSelecionado);
      console.log(formatoValido);
      return formatoValido;
    }

  confirmarTurno() {
    this.turno.dataInicio = new Date(this.dataInicioStr);
    this.turno.dataFim = new Date(this.dataFimStr);

    const motoristaSelecionado = this.listaDrivers.find(driver => driver.pessoa.nif === this.nifSelecionado);

    if (motoristaSelecionado) {
        this.turno.motorista = motoristaSelecionado; // Atribui o motorista ao turno
      } else {
        console.log('Erro: Motorista não encontrado para o NIF selecionado.');
        return; // Sai da função se o motorista não for encontrado
      }

    console.log(this.turno);

    if (!this.isDataValida()) {
      console.log('Erro ao preencher turno: Dados inválidos');
    } else if (this.verificarTurnoExistente()) {
      console.log('Erro: Já existe um turno para este horário.');
    } else {
      console.log('Turno confirmado:', this.turno);
      this.turnosService.postTurno(this.turno).subscribe(
        (novoTurno) => {
           console.log('Turno criado com sucesso!', novoTurno);
        },
        (error) => {
          console.error('Erro ao criar o turno:', error);
        }
      );
      this.listaTurnos.push(this.turno);
    }
  }

  verificarTurnoExistente(): boolean {
    // Verifica se já existe um turno para o mesmo motorista e no mesmo período
    const turnoExistente = this.listaTurnos.some(turno => {
      // Verifica se o turno já existe e se as datas coincidem
      const mesmaDataInicio = this.turno.dataInicio < turno.dataFim && this.turno.dataFim > turno.dataInicio;
      const mesmoMotorista = turno.motorista.pessoa.nif === this.motoristaLogado?.pessoa.nif;

      return mesmaDataInicio && mesmoMotorista;
    });

    return turnoExistente;
  }

  isDataValida(): boolean {

    const duracaoMs = this.turno.dataFim.getTime() - this.turno.dataInicio.getTime();
    const oitoHorasMs = 8 * 60 * 60 * 1000;

    return this.turno.dataInicio < this.turno.dataFim && duracaoMs <= oitoHorasMs;
  }
}
