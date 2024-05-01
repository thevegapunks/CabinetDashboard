import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Appointment} from "../model/appointment.model";

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

}
