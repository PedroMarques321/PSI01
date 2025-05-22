import { Component } from '@angular/core';
import { TaxisService } from '../taxis.service';
import { Taxi } from '../taxi';

@Component({
  selector: 'app-gestor',
  standalone: false,
  templateUrl: './gestor.component.html',
  styleUrl: './gestor.component.scss'
})
export class GestorComponent {

  listaTaxis: Taxi[] = [];

  loading = false;
  errorMessage = '';
  mostrarTaxis = false;
  mostrarEditorTaxi = false;
  taxiAEditar: Taxi | null = null;

  marcasDisponiveis = ['Toyota', 'Mercedes', 'Volkswagen'];
    todosModelos: { [marca: string]: string[] } = {
      Toyota: ['Prius', 'Corolla', 'Yaris'],
      Mercedes: ['Classe A', 'Classe C', 'Classe E'],
      Volkswagen: ['Golf', 'Passat', 'Tiguan']
    };

  modelosDisponiveis: string[] = [];

  constructor(
      private taxisService: TaxisService
    ) {}

  ngOnInit(): void {
        this.getTaxis();
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
     console.log(this.taxiAEditar!.usado);
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
}
