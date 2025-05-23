import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Motorista } from './motorista';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  //private allDriversUrl = 'http://localhost:3001/dashboard/drivers';
  private allDriversUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/drivers';
  //private postDriverUrl = 'http://localhost:3001/dashboard/driver';
  private postDriverUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/driver';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET drivers from the server */
  getDrivers(): Observable<Motorista[]> {
    console.log('getDrivers called');
    return this.http.get<Motorista[]>(this.allDriversUrl)
      .pipe(
        tap(motoristas => {
          console.log('Drivers received:', motoristas);
          console.log('fetched drivers');
        }),
        catchError(this.handleError<Motorista[]>('getDrivers', []))
      );
  }

  /** POST a new driver to the server */
  postDriver(motorista: Motorista): Observable<Motorista> {
    console.log('postDriver called');
    console.log(motorista);
    return this.http.post<Motorista>(this.postDriverUrl, motorista, this.httpOptions)
      .pipe(
        tap(newDriver => {
          console.log('New driver added:', newDriver);
        }),
        catchError(this.handleError<Motorista>('postDriver'))
      );
  }

  /** PUT - Requesitar motorista */
  requesitarDriver(motorista: Motorista): Observable<Motorista> {
    console.log("Motorista a requesitar: ", motorista);
    //const url = `http://localhost:3001/dashboard/requesitar-driver/${motorista._id}`;
    const url = `http://appserver.alunos.di.fc.ul.pt:3001/dashboard/requesitar-driver/${motorista._id}`;

    console.log('requesitarDriver chamado com:', motorista);

    return this.http.put<Motorista>(url, motorista, this.httpOptions).pipe(
      tap(updated => console.log('Motorista requesitado:', updated)),
      catchError(this.handleError<Motorista>('requesitarDriver'))
    );
  }

  /** DELETE - Remover motorista pelo ID */
  removerMotorista(id: string): Observable<any> {
    //const url = `http://localhost:3001/dashboard/driver/remover/${id}`;
    const url = `http://appserver.alunos.di.fc.ul.pt:3001/dashboard/driver/remover/${id}`;
    console.log(`Remover motorista com ID: ${id}`);

    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => console.log(`Motorista com ID ${id} removido.`)),
      catchError(this.handleError('removerMotorista'))
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
