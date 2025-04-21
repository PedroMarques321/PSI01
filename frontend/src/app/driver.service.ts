import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Motorista } from './motorista';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private allDriversUrl = 'http://localhost:3000/dashboard/drivers';
  private postDriverUrl = 'http://localhost:3000/dashboard/driver';

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
  /**
  postDriver(motorista: Motorista): Observable<Motorista> {
    console.log('postDriver called');
    return this.http.post<Driver>(this.postDriverUrl, motorista, this.httpOptions)
      .pipe(
        tap(newDriver => {
          console.log('New driver added:', newDriver);
        }),
        catchError(this.handleError<Driver>('postDriver'))
      );
  }
  */
  /** Tratamento de erro */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
