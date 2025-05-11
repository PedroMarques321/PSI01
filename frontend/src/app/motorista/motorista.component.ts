import { Component } from '@angular/core';
import { TaxisService } from '../taxis.service';
import { DriverService } from '../driver.service';
import { TurnosService } from '../turnos.service';
import { ViagemService } from '../viagem.service';
import { Pessoa, Genero } from '../pessoa';
import { Motorista } from '../motorista';
import { Taxi } from '../taxi';
import { Turno } from '../turno';
import { Viagem } from '../viagem';
import { EstadoPedido } from '../viagem';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-motorista',
  standalone: false,
  templateUrl: './motorista.component.html',
  styleUrl: './motorista.component.scss'
})
export class MotoristaComponent implements OnInit, OnDestroy {

  private viagensSubscription: Subscription | undefined;

  moradaFcul: string = "Faculdade de Ciências da Universidade de Lisboa, Campo Grande, Alvalade, Lisboa, 1749-016, Portugal";
  fculCoordLatitude: number = 38.756734;
  fculCoordLongitude: number = -9.155412;

  partidaCoordLatitude: number = 0;
  partidaCoordLongitude: number = 0;

  destinoCoordLatitude: number = 0;
  destinoCoordLongitude: number = 0;

  listaDrivers: Motorista[] = [];
  listaTaxis: Taxi[] = [];
  listaTaxisDisponiveis: Taxi[] = [];
  listaTurnos: Turno[] = [];
  listaTurnosMotorista: Turno[] = [];
  viagens: Viagem[] = [];
  viagensOrdenadas: Viagem[] = [];

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
    private driverService: DriverService,
    private turnosService: TurnosService,
    private viagemService: ViagemService
  ) {}

  confirmarLogin() {
    const motorista = this.listaDrivers.find(m => m.pessoa.nif === this.nifSelecionado);

     if (motorista && this.nifValido()) {
       this.motoristaLogado = motorista;
       this.loginConfirmado = true;
       this.erroNif = false;
       this.setCurrentTurnos();
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

      // Executa getViagens a cada 3 segundos
      this.viagensSubscription = interval(20000).subscribe(() => {
         this.getViagens();
      });

      this.getViagens();
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

  getViagens(): void {
    this.viagemService.getViagens().subscribe(async (viagens) => {
      const viagensPendentes = viagens.filter(
        v => v.estado === EstadoPedido.PENDENTE || v.estado === EstadoPedido.ACEITE
      );

      for (const viagem of viagensPendentes) {
        // Adiciona distância cliente-motorista
        let distanciaClienteMotorista = await this.calcularDistanciaEntreMoradas(
          this.moradaFcul,
          viagem.moradaPartida
        );
        viagem.distClienteMotorista = distanciaClienteMotorista;
        console.log('A distancia entre cliente e motorista é ', viagem.distClienteMotorista);
        // Adiciona as distâncias a cada viagem
        let distancia = await this.calcularDistanciaEntreMoradas(
          viagem.moradaPartida,
          viagem.moradaChegada
        );
        viagem.quilometros = distancia; // adiciona nova propriedade à viagem
        console.log('A distancia entre chegada e partida é ', viagem.quilometros);
      }

      this.viagens = viagensPendentes;
      this.ordenarViagensPorDistanciaClienteMotorista(this.viagens, this.viagensOrdenadas);
      console.log ('Viagens ordenadas : ', this.viagensOrdenadas);
    });
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
        this.listaTurnosMotorista.push(novoTurno);
    }
  }

  verificarTurnoExistente(): boolean {
    // Verifica se já existe um turno para o mesmo motorista e no mesmo período
    const turnoExistente = this.listaTurnosMotorista.some(turno => {
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
    console.log('Duração é de : ', duracaoMs);

    const oitoHorasMs = 8 * 60 * 60 * 1000;
    console.log('Oito horas são : ', oitoHorasMs);

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
    if (!this.dataInicioStr || !this.dataFimStr) return [];

    const novoInicio = new Date(this.dataInicioStr);
    const novoFim = new Date(this.dataFimStr);
    console.log('Turnos existentes: ' , this.listaTurnos);
    const taxisConflitantes = this.listaTurnos
      .filter(turno => {
        const inicioExistente = new Date(turno.dataInicio);
        const fimExistente = new Date(turno.dataFim);
        console.log('InicioExistente : ', inicioExistente);
        console.log('FimExistente : ', fimExistente);
        console.log('NovoInicio : ', novoInicio);
        console.log('NovoFim : ', novoFim);
        return novoInicio < fimExistente && inicioExistente < novoFim;
      })
      .map(turno => turno.taxi); // Retorna os táxis dos turnos que intersetam
    console.log('Táxis com conflitos:', taxisConflitantes);
    console.log('Táxis todos:', this.listaTaxis);
    return taxisConflitantes;
  }

  setCurrentTurnos(): void {
    this.listaTurnosMotorista = this.listaTurnos.filter(turno =>
        turno.motorista.pessoa.nif === this.motoristaLogado?.pessoa.nif
      );
  }

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km

    const toRadians = (deg: number) => deg * Math.PI / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c;
    return distancia; // em km
  }

  async obterCoordenadasPorEndereco(endereco: string): Promise<{ lat: number; lon: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&addressdetails=1&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MeuAppExemplo/1.0 (meuemail@example.com)'
        }
      });

      const data = await response.json();

      if (data && data.length > 0) {
        const resultado = data[0];
        const lat = parseFloat(resultado.lat);
        const lon = parseFloat(resultado.lon);
        console.log('Coordenadas:', lat, lon);
        console.log('Endereço:', resultado.display_name);

        return { lat, lon };
      } else {
        console.warn('Endereço não encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      return null;
    }
  }

  async calcularDistanciaEntreMoradas(moradaPartida: string, moradaChegada: string): Promise<number | null> {
    const coordsPartida = await this.obterCoordenadasPorEndereco(moradaPartida);
    const coordsChegada = await this.obterCoordenadasPorEndereco(moradaChegada);

    if (!coordsPartida || !coordsChegada) {
      console.warn('Coordenadas não encontradas para uma ou ambas as moradas.');
      return null;
    }

    const distancia = this.haversineDistance(
      coordsPartida.lat,
      coordsPartida.lon,
      coordsChegada.lat,
      coordsChegada.lon
    );

    console.log(`Distância entre as moradas: ${distancia.toFixed(2)} km`);
    return distancia;
  }

  ordenarViagensPorDistanciaClienteMotorista(viagens: Viagem[], viagensOrdenadas: Viagem[]): void {
    // Filtra apenas as que têm distClienteMotorista definido (evita undefined)
    const viagensFiltradas = viagens.filter(v => typeof v.distClienteMotorista === 'number');

    // Ordena com base em distClienteMotorista
    viagensOrdenadas.splice(0, viagensOrdenadas.length, ...viagensFiltradas.sort((a, b) => {
      return (a.distClienteMotorista! - b.distClienteMotorista!);
    }));
  }

  ngOnDestroy(): void {
      // Cancela o intervalo quando o componente for destruído
      if (this.viagensSubscription) {
        this.viagensSubscription.unsubscribe();
      }
  }

  verificarSeEmTurnoAtual(): boolean {
    const agora = new Date();

    return this.listaTurnosMotorista.some((turno) => {
      const inicio = new Date(turno.dataInicio);
      const fim = new Date(turno.dataFim);
      return agora >= inicio && agora <= fim;
    });
  }

   aceitarPedido(viagemId: string, distCM: number, quilometros: number): void {
       const dataAtual = new Date(); // Obter data e hora atual

       // Encontrar o turno correspondente ao momento atual
       const turnoAtual = this.listaTurnosMotorista.find(turno => {
         const inicioTurno = new Date(turno.dataInicio);
         const fimTurno = new Date(turno.dataFim);

         // Verificar se a data/hora atual está dentro do intervalo do turno
         return dataAtual >= inicioTurno && dataAtual <= fimTurno;
       });

       if (turnoAtual) {
         // Se um turno for encontrado, extrair os IDs de motorista e taxi
         const motoristaId = turnoAtual.motorista._id;
         const taxiId = turnoAtual.taxi._id;

         // Verificar se os IDs são válidos (não são nulos ou undefined)
         if (motoristaId && taxiId) {
           // Chamar o serviço para aceitar a viagem, passando os parâmetros necessários
           this.viagemService.aceitarViagem(viagemId, motoristaId, taxiId,distCM, quilometros).subscribe({
             next: (viagem) => {
               console.log('Viagem aceite com sucesso:', viagem);
               // Atualizar UI ou lista conforme necessário
             },
             error: (err) => {
               console.error('Erro ao aceitar viagem:', err);
             }
           });
         } else {
           console.error('Motorista ou Taxi não possuem IDs válidos');
         }
       } else {
         console.log('Nenhum turno encontrado para o momento atual.');
       }
     }

}
