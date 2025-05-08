import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {

  longitude: number = 0;
  latitude: number = 0;

  mostrarFormularioCliente: boolean = true;
  cliente = {
    pessoa: {
      nif: null,
      nome: '',
      genero: true
    }
  };

  novaViagem = {
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

    const pessoaCriada = { ...this.cliente.pessoa };
    const clienteCriado = { pessoaID: null };
    const viagemCriada = {
      ...this.novaViagem,
      clienteIDs: []
    };

    console.log('Pessoa (sem ID):', pessoaCriada);
    console.log('Cliente (sem ID):', clienteCriado);
    console.log('Viagem (sem ID):', viagemCriada);

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
