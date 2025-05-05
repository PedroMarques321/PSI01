import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { TaxisService } from './taxis.service';

import { FormsModule } from '@angular/forms';

// Angular Material Imports
import { MaterialImports } from './material.imports';
import { ManagementComponent } from './management/management.component';
import { MotoristaComponent } from './motorista/motorista.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    ManagementComponent,
    MotoristaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialImports,
    FormsModule,
    HttpClientModule
  ],
  providers: [TaxisService],
  bootstrap: [AppComponent]
})
export class AppModule { }
