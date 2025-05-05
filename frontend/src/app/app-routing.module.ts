import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementComponent} from './management/management.component';
import { MotoristaComponent } from './motorista/motorista.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',component: DashboardComponent,children: [
    { path: 'management', component: ManagementComponent },
    { path: 'motorista', component: MotoristaComponent }
]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
