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

  constructor(
    private driverService: DriverService,
    private taxiService: TaxisService,
    private viagemService: ViagemService
  ) {}

  ngOnInit() {
    this.carregarViagensConcluidas();
    console.log(this.listaViagensConcluidas);
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
}
