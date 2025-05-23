import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { DriverService } from '../driver.service';
import { Taxi } from '../taxi';
import { TaxisService } from '../taxis.service';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';
import { Relatorio } from '../relatorio';

@Component({
  selector: 'app-relatorios',
  standalone: false,
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {

  listaViagensConcluidas: Viagem[] = [];
  listaRelatorios: Relatorio[] = [];
  relatorioExpandido: string | null = null;
  constructor(
    private driverService: DriverService,
    private taxiService: TaxisService,
    private viagemService: ViagemService
  ) {}

  ngOnInit() {
    this.carregarViagensConcluidas();
    console.log(this.listaViagensConcluidas);
  }

  toggleDetalhes(relatorioID: string | null) {
    this.relatorioExpandido = this.relatorioExpandido === relatorioID ? null : relatorioID;
  }

  carregarViagensConcluidas() {
    this.viagemService.getViagensConcluidas().subscribe({
      next: (viagens) => {
        this.listaViagensConcluidas = viagens;
        this.converterParaRelatorios();
      },
      error: (erro) => {
        console.error('Erro ao carregar viagens concluídas:', erro);
      }
    });
  }

  converterParaRelatorios() {
    this.listaRelatorios = this.listaViagensConcluidas.map(viagem => ({
      _id: viagem._id,
      clienteID: viagem.clienteID,
      data: viagem.data,
      horaPartida: viagem.horaPartida || '',
      horaChegada: viagem.horaChegadaEstimada || '',
      motoristaID: viagem.condutorID || '',
      taxiID: viagem.taxiID || '',
      quilometros: viagem.quilometros || 0,
      moradaPartida: viagem.moradaPartida,
      moradaChegada: viagem.moradaChegada,
      preco: viagem.preco,
      tipoServico: viagem.tipoServico,
      estado: 'CONCLUIDO'
    }));
    console.log(this.listaRelatorios);
  }

  filtros = {
    dataInicio: '',
    dataFim: '',
    tipoServico: '',
    motoristaID: ''
  };

  // Campos para estatísticas
  estatisticas = {
    totalKm: 0,
    totalViagens: 0,
    totalFaturado: 0,
    mediaPreco: 0
  };

  calcularEstatisticas() {
    const relatoriosFiltrados = this.aplicarFiltros();
    this.estatisticas = {
      totalKm: relatoriosFiltrados.reduce((sum, r) => sum + r.quilometros, 0),
      totalViagens: relatoriosFiltrados.length,
      totalFaturado: relatoriosFiltrados.reduce((sum, r) => sum + r.preco, 0),
      mediaPreco: relatoriosFiltrados.length ? 
        relatoriosFiltrados.reduce((sum, r) => sum + r.preco, 0) / relatoriosFiltrados.length : 0
    };
  }

  aplicarFiltros(): Relatorio[] {
    return this.listaRelatorios.filter(r => {
      const dataRelatorio = new Date(r.data);
      const dataInicio = this.filtros.dataInicio ? new Date(this.filtros.dataInicio) : null;
      const dataFim = this.filtros.dataFim ? new Date(this.filtros.dataFim) : null;

      return (!dataInicio || dataRelatorio >= dataInicio) &&
             (!dataFim || dataRelatorio <= dataFim) &&
             (!this.filtros.tipoServico || r.tipoServico === this.filtros.tipoServico) &&
             (!this.filtros.motoristaID || r.motoristaID === this.filtros.motoristaID);
    });
  }
}
