import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestorComponent} from './gestor/gestor.component';
import { HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'gestor', component: GestorComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
