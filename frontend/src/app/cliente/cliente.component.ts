import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ViagemService } from '../viagem.service';
import { TaxisService } from '../taxis.service';
import { DriverService } from '../driver.service';
import { PricesService } from '../prices.service';
import { Viagem, EstadoPedido } from '../viagem';
import { Motorista } from '../motorista';
import { Taxi } from '../taxi';
import { Prices } from '../prices';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {

  viagemAceite: Viagem | null = null;
  motoristaAceite: Motorista | null = null;
  taxiAceite: Taxi | null = null;

  tempoEstimadoClienteMinutos: number | null = null;
  tempoPartida: Date | null = null;
  tempoChegada: Date | null = null;

  pedidoAceite: boolean = false;
  private intervaloId: any = null;
  loading: boolean = false;
  longitude: number = 0;
  latitude: number = 0;

  mostrarFormularioCliente: boolean = true;
  cliente = {
    pessoa: {
      nif: '',
      nome: '',
      genero: true
    }
  };

  novaViagem = {
    _id: null,
    sequencia: 1,
    numeroPessoas: 1,
    clienteID: '',
    data: null,
    horaPartida: '',
    horaChegadaEstimada: '',
    condutorID: '',
    taxiID: '',
    quilometros: 0,
    moradaPartida: '',
    moradaChegada: '',
    preco: 0,
    tipoServico: 'Normal',
    estado: 'PENDENTE'
  }

  novaViagem2 = {
    sequencia: 1,
    numeroPessoas: 1,
    clienteID: '',
    periodo: {
      inicio: null,
      fim: null
    },
    condutorID: '',
    quilometros: 0,
    moradaPartida: '',
    moradaChegada: ''
  };

  precos: Prices | null = null;

  precoFinalNormal: number | null = null;
  precoFinalLuxo: number | null = null;

  readonly  TAXA_NOTURNA_INICIO = 21;
  readonly  TAXA_NOTURNA_FIM = 6;

  constructor(
      private taxisService: TaxisService,
      private driverService: DriverService,
      private viagemService: ViagemService,
      private pricesService: PricesService
    ) {}

  ngOnInit(): void {
    this.obterLocalizacaoAtual();
    this.getPrecos();
  }


  registarClienteViagem(): void {
    if (!this.nifValido()) {
      console.warn('NIF inválido.');
      return;
    }

    if (!this.nomeValido()) {
      console.warn('Nome inválido.');
      return;
    }

    if (!this.novaViagem.moradaPartida || !this.novaViagem.moradaChegada) {
      console.warn('Morada de partida ou chegada está vazia.');
      return;
    }

    const viagemParaEnviar = {
      ...this.novaViagem,
      clienteID: this.cliente.pessoa.nif,
      data: new Date(),
      estado: EstadoPedido.PENDENTE
    }

    this.viagemService.postViagem(viagemParaEnviar).subscribe(
      (viagem) => {
        console.log('Viagem criada:', viagem);
      },
      (error) => {
        console.error('Erro ao criar viagem:', error);
      }
    );

    const pessoaCriada = { ...this.cliente.pessoa };
    const clienteCriado = { pessoaID: null };
    const viagemCriada = {
      ...this.novaViagem,
      clienteIDs: [clienteCriado]
    };



    console.log('Pessoa (sem ID):', pessoaCriada);
    console.log('Cliente (sem ID):', clienteCriado);
    console.log('Viagem (sem ID):', viagemCriada);

    this.startFetchingViagem(this.cliente.pessoa.nif);
  }

// Método para chamar o getViagemByNif a cada 2 segundos
startFetchingViagem(nif: string): void {
  this.fetchViagemByNif(nif);  // chamada inicial

  // Guarda a referência do intervalo
  this.intervaloId = setInterval(() => {
    this.fetchViagemByNif(nif);
  }, 2000);
}

fetchViagemByNif(nif: string): void {
  this.loading = true;

  this.viagemService.getViagemByNif(nif).subscribe(
    (viagem) => {
      console.log('Viagem encontrada pelo NIF:', viagem);

      if (viagem.estado === EstadoPedido.ACEITE) {
         this.viagemAceite = viagem;
         this.stopFetchingViagem();
         console.log('Viagem aceite por um motorista');
         this.pedidoAceite = true;
         this.loading = false;
         this.tempoEstimadoClienteMinutos = (viagem.distClienteMotorista ?? 0) * 4; // 4 mins por kilometro

         this.calcularHoraPartidaEChegada();
         this.calcularPrecoFinal();

         if (viagem.condutorID && viagem.taxiID) {
           this.buscarMotoristaETaxi(viagem.condutorID, viagem.taxiID);
         } else {
           console.error('Erro: Condutor ou Táxi não encontrado!');
         }

      }
    },
    (error) => {
      this.loading = false;
      console.error('Erro ao buscar viagem pelo NIF:', error);
    }
  );
}

stopFetchingViagem(): void {
  if (this.intervaloId) {
    clearInterval(this.intervaloId);
    this.intervaloId = null;
    console.log('Intervalo parado');
  }
}

 cancelarViagem(): void {
   const nif = this.cliente.pessoa.nif;

   this.viagemService.getViagemByNif(nif).subscribe(
     (viagem) => {
       if (viagem && viagem._id) {
         this.viagemService.cancelarViagem(viagem._id).subscribe(
           (res) => {
             console.log('Viagem cancelada com sucesso:', res);
             this.stopFetchingViagem(); // para o intervalo de polling
             this.loading = false;
           },
           (err) => {
             console.error('Erro ao cancelar viagem:', err);
           }
         );
       } else {
         console.warn('Nenhuma viagem encontrada para cancelar.');
       }
     },
     (error) => {
       console.error('Erro ao buscar viagem para cancelamento:', error);
     }
   );
 }

  gerarId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  nifValido(): boolean {

      const nif = String(this.cliente.pessoa.nif);
      const formatoValido = /^[0-9]{9}$/.test(nif);

      return formatoValido;
  }

  nomeValido(): boolean {
      return /^[A-Za-zÀ-ÿ\s]+$/.test(this.cliente.pessoa.nome);
  }

  obterLocalizacaoAtual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Localização obtida:', this.latitude, this.longitude);
          this.obterEnderecoPorCoordenadas();
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    } else {
      console.error('Geolocalização não suportada');
    }
  }

  obterEnderecoPorCoordenadas(): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${this.latitude}&lon=${this.longitude}&format=json&addressdetails=1`;
    console.log(url);

    fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Resposta completa da API:', data); // DEBUG

      if (data && data.display_name) {
        console.log('Endereço encontrado:', data.display_name);
        this.novaViagem.moradaPartida = data.display_name;
      } else {
        console.warn('Endereço não encontrado na resposta.');
      }
    })
    .catch(error => {
      console.error('Erro ao obter endereço:', error);
    });
  }

  obterCoordenadasPorEndereço(endereco: String): void {

   //const endereco = encodeURIComponent('Avenida da Liberdade, Lisboa, Portugal');
   const url = `https://nominatim.openstreetmap.org/search?q=${endereco}&format=json&addressdetails=1&limit=1`;

   fetch(url, {
     headers: {
       'Accept': 'application/json',
       'User-Agent': 'MeuAppExemplo/1.0 (meuemail@example.com)'
     }
   })
   .then(response => response.json())
   .then(data => {
     if (data && data.length > 0) {
       const resultado = data[0];
       console.log('Coordenadas:', resultado.lat, resultado.lon);
       console.log('Endereço:', resultado.display_name);
       this.novaViagem.moradaChegada = resultado.display_name;
     } else {
       console.warn('Endereço não encontrado.');
     }
   })
   .catch(error => {
     console.error('Erro na geocodificação:', error);
   });



  }

  buscarMotoristaETaxi(motoristaId: string, taxiId: string): void {
    // Fazendo o pedido para obter os motoristas e táxis
    this.driverService.getDrivers().subscribe({
      next: (motoristas) => {
        // Procurando o motorista com o id correspondente
        this.motoristaAceite = motoristas.find(motorista => motorista._id === motoristaId) || null;
        console.log('Motorista encontrado:', this.motoristaAceite);

        // Depois de encontrar o motorista, fazemos o pedido para obter os táxis
        this.taxisService.getTaxis().subscribe({
          next: (taxis: Taxi[]) => {
            // Procurando o táxi com o id correspondente
            this.taxiAceite = taxis.find((taxi: Taxi) => taxi._id === taxiId) || null;
            console.log('Táxi encontrado:', this.taxiAceite);
          },
          error: (err: HttpErrorResponse) => {  // Usando HttpErrorResponse
            console.error('Erro ao buscar táxis:', err.message);
          }
        });
      },
      error: (err: HttpErrorResponse) => {  // Usando HttpErrorResponse
        console.error('Erro ao buscar motoristas:', err.message);
      }
    });
  }

  calcularHoraPartidaEChegada(): void {

    let minutosAteC = Math.floor(this.tempoEstimadoClienteMinutos!);
    let agora = new Date();
    this.tempoPartida =  new Date(agora.getTime() + minutosAteC * 60000);
    console.log('Quilometros feitos na viagem : ', this.viagemAceite!.quilometros);
    let minutosEstimados = (this.viagemAceite!.quilometros ?? 0) * 4;
    this.tempoChegada = new Date(this.tempoPartida.getTime() + minutosEstimados * 60000);
  }

  getPrecos(): void {

        this.loading = true;
        this.pricesService.getPrices()
          .subscribe(
            (preco: Prices) => {
              console.log('Preços recebido:', preco);
              this.precos = preco;
              this.loading = false;
            },
            (error: any) => {
              console.log( 'Erro ao carregar os preços: ' + error.message);
              this.loading = false;
            }
          );
    }


  calcularPrecoFinal(): void {

    if (this.tempoPartida && this.tempoChegada) {
     console.log('Hora de partida : ', this.tempoPartida);
     console.log('Hora de chegada : ', this.tempoChegada);
     console.log('Calculando os preços...');
      if (this.tempoChegada.getTime() < this.tempoPartida.getTime()) {
            this.tempoChegada.setDate(this.tempoChegada.getDate() + 1); // Aumenta o dia para corrigir o cálculo
      }

      let minutosNoturnos = 0;
      let current = new Date(this.tempoPartida);

      while (current < this.tempoChegada) {
        const hora = current.getHours();
        if (hora >= this.TAXA_NOTURNA_INICIO || hora < this.TAXA_NOTURNA_FIM) {
          minutosNoturnos++;
        }

        current.setMinutes(current.getMinutes() + 1);
      }

      const duracaoMin = (this.tempoChegada.getTime() - this.tempoPartida.getTime()) / 60000;
      const minutosNormais = duracaoMin - minutosNoturnos;

      //Conforto normal
      console.log('Minutos normais : ', minutosNormais );
      this.precoFinalNormal = minutosNormais*this.precos!.taxa_normal + minutosNoturnos*this.precos!.taxa_normal*((this.precos!.acrescimo_noturno+100)/100);
      this.precoFinalLuxo = minutosNormais*this.precos!.taxa_luxo + minutosNoturnos*this.precos!.taxa_luxo*((this.precos!.acrescimo_noturno+100)/100);

    }

    }

  aceitarMotorista(): void {}

  rejeitarMotorista(): void {}


}
