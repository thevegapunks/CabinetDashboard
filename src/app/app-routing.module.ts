import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientComponent} from "./patient/patient.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CabinetComponent} from "./cabinet/cabinet.component";
import {AppointmentComponent} from "./appointment/appointment.component";
import {MedicalstaffComponent} from "./medicalstaff/medicalstaff.component";
import {DocumentComponent} from "./document/document.component";
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
 export const routes: Routes = [
  {
    path: 'dashboard', title: 'Mydoc Dashboard', component: DashboardComponent,
    children:[
      {path : "cabinet",component : CabinetComponent},
      {path : "patient",component : PatientComponent},
      {path : "appointment",component : AppointmentComponent},
      {path : "medicalstaff",component : MedicalstaffComponent},
      {path : "document",component : DocumentComponent},
    ]},
  {path : "signin",component : SigninComponent},
  {path : "signup",component : SignupComponent},
  {path : "",component : DashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
