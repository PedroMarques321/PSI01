import { Component } from '@angular/core';
import { Taxi } from '../taxi';

@Component({
  selector: 'app-management',
  standalone: false,
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {

   marcasDisponiveis = ['Toyota', 'Mercedes', 'Volkswagen'];
      modelosDisponiveis = ['Prius', 'Classe E', 'Golf'];

      dataInvalida = true;

      novoTaxi: Taxi = { // cria com valores default para não se queixar
          _id: null,
          modelo: 'Prius',
          marca: 'Toyota',
          conforto: 'Normal',
          matricula: 'AA-00-AA',
          ano_de_compra: new Date()
        };

      listaTaxis: Taxi[] = [];

      registarTaxi() {

        if (!this.validarMatricula(this.novoTaxi.matricula)) {
              console.log('Matrícula inválida!');
              return;
        }

        if(this.validarData()) {
          console.log('Data inválida!');
          return;
        }

        this.formatarData(this.novoTaxi.ano_de_compra);


        // validacoes aqui
        const taxiRegistado = {
          ...this.novoTaxi,
        };

        // adiciona ao topo da lista
        this.listaTaxis.unshift(taxiRegistado);

        this.limparTaxi();
      }

       validarMatricula(matricula: string): boolean {
        const regex = /^\d{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-\d{2}$|^[A-Za-z]{2}-[A-Za-z]{2}-\d{2}$|^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$|^\d{2}-[A-Za-z]{2}-[A-Za-z]{2}$/;

        return regex.test(matricula);
      }

      validarData() {
          const dataInserida = new Date(this.novoTaxi.ano_de_compra); // Data inserida pelo usuário
          const dataAtual = new Date(); // Data atual

          return dataInserida > dataAtual;
      }

      formatarData(data: any): string {
        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
      }

       limparTaxi() {
          this.novoTaxi = {
            _id: null,
            modelo: 'Prius',
            marca: 'Toyota',
            conforto: 'Normal',
            matricula: 'AA-00-AA',
            ano_de_compra: new Date()
          };
      }
}
