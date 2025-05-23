import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  //private initUrl = 'http://localhost:3001/init';
  private initUrl = 'http://appserver.alunos.di.fc.ul.pt:3001/init';

  constructor(private http: HttpClient) { }

  initDatabase(): Observable<any> {
    console.log('Initializing database...');
    return this.http.get(this.initUrl).pipe(
      tap(response => console.log('Database initialized', response)),
      catchError(this.handleError<any>('initDatabase'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
