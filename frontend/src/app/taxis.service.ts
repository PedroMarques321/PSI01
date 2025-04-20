import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Taxi } from './taxi';

@Injectable({
  providedIn: 'root'
})
export class TaxisService {

  private allTaxisUrl = 'http://localhost:3000/dashboard/taxis';
  private postTaxiUrl = 'http://localhost:3000/dashboard/taxi';

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

  constructor(private http: HttpClient) { }

  /** GET taxis from the server */
  getTaxis(): Observable<Taxi[]> {
    console.log('getTaxis called');
    return this.http.get<Taxi[]>(this.allTaxisUrl)
      .pipe(
        tap(taxis => {
          console.log('Taxis received:', taxis);
          console.log('fetched taxis');
        }),
        catchError(this.handleError<Taxi[]>('getTaxis', []))
      );
  }

  /** POST a new taxi to the server */
  postTaxi(taxi: Taxi): Observable<Taxi> {
    console.log('postTaxi called');
    return this.http.post<Taxi>(this.postTaxiUrl, taxi, this.httpOptions)
      .pipe(
        tap(newTaxi => {
          console.log('New taxi added:', newTaxi);
        }),
        catchError(this.handleError<Taxi>('postTaxi'))
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
