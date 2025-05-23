import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Turno } from './turno'; // Modelo de Turno

@Injectable({
  providedIn: 'root',
})
export class TurnosService {

  // URL para o backend (ajuste conforme necessário)
  //private allTurnosUrl = 'http://localhost:3001/dashboard/turnos';
  private allTurnosUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/turnos';
  //private postTurnoUrl = 'http://localhost:3001/dashboard/turno';
  private postTurnoUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/turno';

  // Configuração de headers para enviar e receber JSON
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /** GET turnos from the server */
  getTurnos(): Observable<Turno[]> {
    console.log('getTurnos called');
    return this.http.get<Turno[]>(this.allTurnosUrl)
      .pipe(
        tap(turnos => {
          console.log('Turnos received:', turnos);
          console.log('fetched turnos');
        }),
        catchError(this.handleError<Turno[]>('getTurnos', []))
      );
  }

  /** POST a new turno to the server */
  postTurno(turno: Turno): Observable<Turno> {
    console.log('postTurno called');
    return this.http.post<Turno>(this.postTurnoUrl, turno, this.httpOptions)
      .pipe(
        tap(newTurno => {
          console.log('New turno added:', newTurno);
        }),
        catchError(this.handleError<Turno>('postTurno'))
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
