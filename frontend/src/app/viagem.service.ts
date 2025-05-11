import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Viagem, EstadoPedido } from './viagem';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {

  private viagensUrl = 'http://localhost:3000/dashboard/viagens';
  private viagemUrl = 'http://localhost:3000/dashboard/viagem';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Obter todas as viagens
  getViagens(): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(this.viagensUrl)
      .pipe(catchError(this.handleError<Viagem[]>('getViagens', [])));
  }

  // Obter uma viagem por ID
  getViagem(id: string): Observable<Viagem> {
    const url = `${this.viagemUrl}/${id}`;
    return this.http.get<Viagem>(url).pipe(catchError(this.handleError<Viagem>(`getViagem id=${id}`)));
  }

  // Criar uma nova viagem
  postViagem(viagem: Viagem): Observable<Viagem> {
    console.log('postViagem called');
    return this.http.post<Viagem>(this.viagemUrl, viagem, this.httpOptions)
      .pipe(
        tap(newViagem => {
          console.log('New viagem added:', newViagem);
        }),
        catchError(this.handleError<Viagem>('postViagem'))
      );
  }

  // Atualizar uma viagem existente
  putViagem(viagem: Viagem): Observable<Viagem> {
    const url = `${this.viagensUrl}/${viagem._id}`;
    return this.http.put<Viagem>(url, viagem, this.httpOptions)
      .pipe(
        tap(updatedViagem => {
          console.log('Updated viagem:', updatedViagem);
        }),
        catchError(this.handleError<Viagem>('putViagem'))
      );
  }
  //Get viagem pelo nif do cliente que fez o pedido
  getViagemByNif(nif: string): Observable<Viagem> {
    const url = `http://localhost:3000/dashboard/viagemNif/${nif}`;
    return this.http.get<Viagem>(url)
      .pipe(catchError(this.handleError<Viagem>('getViagemByNif')));
  }

  cancelarViagem(id: string): Observable<Viagem> {
    const url = `http://localhost:3000/dashboard/viagem/cancelar/${id}`;
    return this.http.put<Viagem>(url, null, this.httpOptions).pipe(
      tap(cancelada => {
        console.log('Viagem cancelada:', cancelada);
      }),
      catchError(this.handleError<Viagem>('cancelarViagem'))
    );
  }

  aceitarViagem(viagemId: string, motoristaId: string, taxiId: string, distCM: number, quilometros: number): Observable<Viagem> {
    const url = `http://localhost:3000/dashboard/viagem/aceitar/${viagemId}/${motoristaId}/${taxiId}/${distCM}/${quilometros}`;

    return this.http.put<Viagem>(url, this.httpOptions)
      .pipe(
        tap((viagem) => {
          console.log('Viagem aceite:', viagem);
        }),
        catchError(this.handleError<Viagem>('aceitarViagem'))
      );
  }


  /** Tratamento de erro */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
