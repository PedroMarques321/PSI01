import { Component, OnInit } from '@angular/core';
import { InitServiceService } from './init-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Web Taxi';

  constructor(private initService: InitServiceService) { }

  ngOnInit(): void {
    this.initializeDatabase();
  }

  initializeDatabase(): void {
    this.initService.initDatabase()
      .subscribe({
        next: (response) => {
          console.log('Database initialized successfully:', response);
        },
        error: (error) => {
          console.error('Error initializing database:', error);
        }
      });
  }
}
