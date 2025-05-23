import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Prices } from './prices';

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  //private pricesUrl = 'http://localhost:3001/dashboard/prices';
  private pricesUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/prices';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET prices from the server */
  getPrices(): Observable<Prices> {
    console.log('getPrices called');
    return this.http.get<Prices>(this.pricesUrl)
      .pipe(
        tap(prices => console.log('Fetched prices:', prices)),
        catchError(this.handleError<Prices>('getPrices'))
      );
  }

  /** PUT: update the prices on the server */
  updatePrices(prices: Prices): Observable<Prices> {
    console.log('updatePrices called');
    return this.http.put<Prices>(this.pricesUrl, prices, this.httpOptions)
      .pipe(
        tap(newPrices => console.log('Updated prices:', newPrices)),
        catchError(this.handleError<Prices>('updatePrices'))
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
