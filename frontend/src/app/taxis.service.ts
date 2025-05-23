import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable , of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Taxi } from './taxi';

@Injectable({
  providedIn: 'root'
})
export class TaxisService {

  //private allTaxisUrl = 'http://localhost:3001/dashboard'
  private allTaxisUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard';
  //private postTaxiUrl = 'http://localhost:3001/dashboard/taxi';
  private postTaxiUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/taxi';
  //private putTaxiUrl = 'http://localhost:3001/dashboard/requesitar-taxi';
  private putTaxiUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/dashboard/requesitar-taxi';

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

  requesitarTaxi(taxi: Taxi): Observable<Taxi> {

    const url = `${this.putTaxiUrl}/${taxi._id}`;
    console.log('requesitarTaxi called');
    console.log(url);
    return this.http.put<Taxi>(url ,{}, this.httpOptions)
          .pipe(
            tap(requestedTaxi => {
              console.log('New taxi requested:', requestedTaxi.requesitado);
            }),
            catchError(this.handleError<Taxi>('requesitarTaxi'))
          );
    }

  usarTaxi(taxiID: string): Observable<Taxi> {
    //const url = `http://localhost:3001/dashboard/taxi/usar/${taxiID}`;
    const url = `http://appserver.alunos.di.fc.ul.pt:3001/dashboard/taxi/usar/${taxiID}`;
    console.log('usarTaxi called - URL:', url);

    return this.http.put<Taxi>(url, {}, this.httpOptions).pipe(
      tap(usedTaxi => {
        console.log('Táxi marcado como usado:', usedTaxi.usado);
      }),
      catchError(this.handleError<Taxi>('usarTaxi'))
    );
  }

  removerTaxi(id: string): Observable<any> {
    //const url = `http://localhost:3001/dashboard/taxi/remover/${id}`;
    const url = `http://appserver.alunos.di.fc.ul.pt:3001/dashboard/taxi/remover/${id}`;
    console.log('removerTaxi called - URL:', url);

    return this.http.delete(url, this.httpOptions).pipe(
      tap(() => {
        console.log(`Táxi com ID ${id} removido com sucesso`);
      }),
      catchError(this.handleError<any>('removerTaxi'))
    );
  }

  updateTaxi(taxi: Taxi): Observable<Taxi> {
    //const url = `http://localhost:3001/dashboard/taxi/update/${taxi._id}`;
    const url = `http://appserver.alunos.di.fc.ul.pt:3001/dashboard/taxi/update/${taxi._id}`;
    console.log('updateTaxi called:', taxi);

    return this.http.put<Taxi>(url, taxi, this.httpOptions).pipe(
      tap(updatedTaxi => {
        console.log('Táxi atualizado com sucesso:', updatedTaxi);
      }),
      catchError(this.handleError<Taxi>('updateTaxi'))
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
