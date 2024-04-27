import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Patient} from "../model/patient.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http:HttpClient) {}


  public getPatients():Observable<Array<Patient>>{
    return this.http.get<Array<Patient>>(environment.backendHost+"/patients")
  }

  public searchPatients(keyword : string):Observable<Array<Patient>>{
    return this.http.get<Array<Patient>>(environment.backendHost+"/patients/search?keyword="+keyword)
  }

  public savePatient(patient : Patient):Observable<Patient>{
    return this.http.post<Patient>(environment.backendHost+"/patients/savePatientWithAppointment",patient)
  }
  public updatePatient(patient : Patient):Observable<Patient>{
    return this.http.post<Patient>(environment.backendHost+"/patients",patient)
  }
  public deletePatient(id : number){
    return this.http.delete(environment.backendHost+"/patients/"+id)
  }

}
