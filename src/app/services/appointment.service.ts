import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Appointment} from "../model/appointment.model";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) {}


  public getAppointments():Observable<Array<Appointment>>{
    return this.http.get<Array<Appointment>>(environment.backendHost+"/appointments")
  }

  public searchAppointments(keyword : string):Observable<Array<Appointment>>{
    return this.http.get<Array<Appointment>>(environment.backendHost+"/appointments/search?keyword="+keyword)
  }

  public saveAppointment(appointment : Appointment):Observable<Appointment>{
    return this.http.post<Appointment>(environment.backendHost+"/appointments",appointment)
  }
  public updateAppointment(appointment : Appointment):Observable<Appointment>{
    return this.http.post<Appointment>(environment.backendHost+"/appointments",appointment)
  }
  public deleteAppointment(id : number){
    return this.http.delete(environment.backendHost+"/appointments/deleteById/"+id)
  }

  searchAppointmentsByWeek(startDate: Date, endDate: Date): Observable<Appointment[]> {
    // Formater les dates au format ISO 8601 (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const url = `${environment.backendHost}/appointments/searchbyweek?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

    return this.http.get<Appointment[]>(url).pipe(
      catchError(err => {
        console.error('Error searching appointments by week:', err);
        return throwError(err);
      })
    );
  }
  searchAppointmentsByMonth(startMonth: Date, endMonth: Date): Observable<Appointment[]> {
    const startDate = startMonth.toISOString().split('T')[0];
    const endDate = endMonth.toISOString().split('T')[0];
    const url = `${environment.backendHost}/appointments/searchbyMounth?startMounth=${startDate}&endMounth=${endDate}`;
    return this.http.get<Appointment[]>(url).pipe(
      catchError(err => {
        console.error('Error searching appointments by month:', err);
        return throwError(err);
      })
    );
  }
  searchAppointmentsByYear(year: number): Observable<Appointment[]> {
    const url = `${environment.backendHost}/appointments/searchbyYear?year=${year}`;
    return this.http.get<Appointment[]>(url).pipe(
      catchError(err => {
        console.error('Error searching appointments by year:', err);
        return throwError(err);
      })
    );
  }

}
