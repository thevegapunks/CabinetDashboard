import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientComponent } from "./patient/patient.component";
import { CabinetComponent } from "./cabinet/cabinet.component";
import { AppointmentComponent } from "./appointment/appointment.component";
import { DocumentComponent } from "./document/document.component";
import { MedicalstaffComponent } from "./medicalstaff/medicalstaff.component";
import {DashboardComponent} from "./dashboard/dashboard.component";


@NgModule({
  declarations: [
    AppComponent,
    PatientComponent,
    CabinetComponent,
    AppointmentComponent,
    DashboardComponent,
    DocumentComponent,
    MedicalstaffComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
