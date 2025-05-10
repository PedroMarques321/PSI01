import { Component } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { Viagem, EstadoPedido } from '../viagem';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {

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

  constructor(private viagemService: ViagemService) { }

  ngOnInit(): void {
    this.obterLocalizacaoAtual();
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
         this.stopFetchingViagem();
         this.loading = false;
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


}
