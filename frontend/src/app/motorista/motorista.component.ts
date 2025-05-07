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
  listaTaxisDisponiveis: Taxi[] = [];
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
      const novoTurno: Turno = {
        dataInicio: new Date(this.turno.dataInicio),
        dataFim: new Date(this.turno.dataFim),
        motorista: JSON.parse(JSON.stringify(this.turno.motorista)), // cópia profunda
        taxi: JSON.parse(JSON.stringify(this.turno.taxi))            // cópia profunda
      };

        this.listaTurnos.push(novoTurno);
    }
  }

  verificarTurnoExistente(): boolean {
    // Verifica se já existe um turno para o mesmo motorista e no mesmo período
    const turnoExistente = this.listaTurnos.some(turno => {
      const inicioAtual = new Date(turno.dataInicio);
      const fimAtual = new Date(turno.dataFim);
      // Verifica se o turno já existe e se as datas coincidem
      console.log('Turno Atual - Início:', inicioAtual, 'Fim:', fimAtual);
      console.log('Turno Existente - Início:', this.turno.dataInicio, 'Fim:', this.turno.dataFim);

      const mesmaDataInicio = this.turno.dataInicio < fimAtual && this.turno.dataFim > inicioAtual;
      const mesmoMotorista = turno.motorista.pessoa.nif === this.motoristaLogado?.pessoa.nif;

      console.log('Datas coincidem: ',mesmaDataInicio);
      console.log('Motorista coincide: ',mesmoMotorista);
      return mesmaDataInicio && mesmoMotorista;
    });

    return turnoExistente;
  }

  isDataValida(): boolean {

    const duracaoMs = this.turno.dataFim.getTime() - this.turno.dataInicio.getTime();
    const oitoHorasMs = 8 * 60 * 60 * 1000;

    return this.turno.dataInicio < this.turno.dataFim && duracaoMs <= oitoHorasMs;
  }

  onDateChange(): void {
    const conflitos = this.verificarTurnoTaxisExistente();
    if (conflitos.length > 0) {
      this.listaTaxisDisponiveis = this.listaTaxis.filter(taxi =>
            !conflitos.some(conflictTaxi => conflictTaxi.matricula === taxi.matricula)
      );
    } else {
      this.listaTaxisDisponiveis = this.listaTaxis;
      console.log('Nenhum conflito de turno encontrado.');
    }
  }

  verificarTurnoTaxisExistente(): Taxi[] {
    console.log('hey');
    if (!this.dataInicioStr || !this.dataFimStr) return [];

    const novoInicio = new Date(this.dataInicioStr);
    const novoFim = new Date(this.dataFimStr);

    const taxisConflitantes = this.listaTurnos
      .filter(turno => {
        const inicioExistente = new Date(turno.dataInicio);
        const fimExistente = new Date(turno.dataFim);
        return novoInicio < fimExistente && inicioExistente < novoFim;
      })
      .map(turno => turno.taxi); // Retorna os táxis dos turnos que intersetam
    console.log('Táxis com conflitos:', taxisConflitantes);
    console.log('Táxis todos:', this.listaTaxis);
    return taxisConflitantes;
  }
}
