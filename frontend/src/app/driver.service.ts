import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Driver } from './driver';

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
  getDrivers(): Observable<Driver[]> {
    console.log('getDrivers called');
    return this.http.get<Driver[]>(this.allDriversUrl)
      .pipe(
        tap(drivers => {
          console.log('Drivers received:', drivers);
          console.log('fetched drivers');
        }),
        catchError(this.handleError<Driver[]>('getDrivers', []))
      );
  }

  /** POST a new driver to the server */
  postDriver(driver: Driver): Observable<Driver> {
    console.log('postDriver called');
    return this.http.post<Driver>(this.postDriverUrl, driver, this.httpOptions)
      .pipe(
        tap(newDriver => {
          console.log('New driver added:', newDriver);
        }),
        catchError(this.handleError<Driver>('postDriver'))
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
