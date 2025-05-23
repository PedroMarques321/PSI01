import { Component } from '@angular/core';
import { Motorista } from '../motorista';
import { DriverService } from '../driver.service';
import { Taxi } from '../taxi';
import { TaxisService } from '../taxis.service';
import { Viagem } from '../viagem';
import { ViagemService } from '../viagem.service';

@Component({
  selector: 'app-relatorios',
  standalone: false,
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {

  listaRelatorios: Viagem[] = [];

  constructor(
    private driverService: DriverService,
    private taxiService: TaxisService,
    private viagemService: ViagemService
  ) {}

  ngOnInit() {}

}
