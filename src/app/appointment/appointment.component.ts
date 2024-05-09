import {booleanAttribute, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Observable, throwError } from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Appointment } from "../model/appointment.model";
import { IllnessState } from "../shared/enums/illnessState.enum";
import { PatientState } from "../shared/enums/PatientState.enum";
import { catchError, map } from "rxjs/operators";
import { AppointmentService } from "../services/appointment.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'

})
export class AppointmentComponent implements OnInit{

  appointments$: Observable<Appointment[]> = new Observable<Appointment[]>();
  appointments !: Observable<Array<Appointment>>;
  appointment!: Appointment;
  statesOfIllness: string[] = Object.keys(IllnessState).map(key => IllnessState[key as keyof typeof IllnessState]);
  statesOfPatient: string[] = Object.keys(PatientState).map(key => PatientState[key as keyof typeof PatientState]);
  errorMessage !: string;
  searchFormGroup !: FormGroup | undefined;
  closeResult!: string;
  newAppointmentFormGroup! :FormGroup;
  editAppointmentFormGroup!: FormGroup;


  @ViewChild('myModal') myModal!: TemplateRef<any>;

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.initializeForm();


    this.searchFormGroup = this.fb.group({
      keyword : [this.getCurrentDate()]
    })
    this.handleSearchAppointments();
    this.newAppointmentFormGroup = this.fb.group({
      date: this.fb.control(this.getCurrentDate(),[Validators.required]),
      time : this.fb.control(this.getCurrentTime(),[Validators.required]),
      reasonOfAppointment : this.fb.control(null,[Validators.required]),
      activationState : this.fb.control(true, [Validators.required]), // Définir la valeur à true ici
      confirmation : this.fb.control(false, [Validators.required]), // Définir la valeur à true ici
      stateOfIllness : this.fb.control('Select stateOfIllness',[Validators.required]),
      stateOfPatient : this.fb.control('Select stateOfPatient',[Validators.required]),

    })
    this.editAppointmentFormGroup = this.fb.group({
      idAppointment : this.fb.control(null),
      date: this.fb.control(null,[Validators.required]),
      time : this.fb.control(null,[Validators.required]),
      reasonOfAppointment : this.fb.control(null,[Validators.required]),
      activationState : this.fb.control(null,[Validators.required]),
      confirmation : this.fb.control(null,[Validators.required]),
      stateOfIllness : this.fb.control('Select stateOfIllness',[Validators.required]),
      stateOfPatient : this.fb.control('Select stateOfPatient',[Validators.required]),
    })
  }
  initializeForm(): void {
    this.searchFormGroup = this.fb.group({
        keyword: this.fb.control("")
      // keyword: [this.getCurrentDate(), [Validators.required]]
    });
  }
  handleUpdateAppointment(){
    let appointment : Appointment=this.editAppointmentFormGroup.value;
    this.appointmentService.updateAppointment(appointment).subscribe({
      next : value => {
        alert("Appointment has been successfully updated ");
        this.handleSearchAppointments();
      },error : err => {
        console.log(err);
      }
    });
  }
  handleSaveAppointment(){
    let appointment : Appointment=this.newAppointmentFormGroup.value;
    this.appointmentService.updateAppointment(appointment).subscribe({
      next : value => {
        alert("Appointment has been successfully saved ");
        this.ngOnInit();
      },error : err => {
        alert("Appointment has not been  saved ");
        console.log(err);
      }
    });
  }
  handleDeleteAppointment(a: Appointment) {
    let conf = confirm("Are you sure?");
    if (!conf) return;
    this.appointmentService.deleteAppointment(a.idAppointment).subscribe({
      next: (resp) => {
        this.appointments = this.appointments.pipe(
          map(data => {
            let index = data.indexOf(a);
            data.slice(index, 1)
            return data;
          })
        );
      },
      error: err => {
        console.log(err);
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openDetails(targetModal: any, appointment: Appointment) {
    if (appointment) {
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });

      // @ts-ignore
      document.getElementById('date0').setAttribute('value', appointment.date);
      // @ts-ignore
      document.getElementById('time0').setAttribute('value', appointment.time);
      // @ts-ignore
      document.getElementById('reasonOfAppointment0').setAttribute('value', appointment.reasonOfAppointment);
      // @ts-ignore
      document.getElementById('activationState0').setAttribute('value', appointment.activationState);
      // @ts-ignore
      document.getElementById('confirmation0').setAttribute('value', appointment.confirmation);
      // @ts-ignore
      document.getElementById('stateOfIllness0').setAttribute('value', appointment.stateOfIllness);
      // @ts-ignore
      document.getElementById('stateOfPatient0').setAttribute('value', appointment.stateOfPatient);

    } else {
      console.error("Patient is null or undefined");
    }

  }
  openEdit(updateAppointment: TemplateRef<any>, appointment: Appointment) {
    if (appointment) {
      // Mise à jour des valeurs du formulaire de modification
      this.editAppointmentFormGroup.patchValue({
        idAppointment: appointment.idAppointment,
        date: appointment.date, // Mise à jour avec la date de l'appointment existant
        time: appointment.time,
        reasonOfAppointment: appointment.reasonOfAppointment,
        activationState: appointment.activationState ? 'TRUE' : 'FALSE',
        confirmation: appointment.confirmation ? 'TRUE' : 'FALSE',
        stateOfIllness: appointment.stateOfIllness,
        stateOfPatient: appointment.stateOfPatient
      });

      // Mise à jour de la valeur de recherche avec la date de l'appointment
      this.searchFormGroup?.patchValue({
        keyword: appointment.date
      });

      // Recherche des rendez-vous pour la nouvelle date sélectionnée
      this.handleSearchAppointments();

      // Ouvrir le formulaire de modification
      this.modalService.open(updateAppointment, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });
    } else {
      console.error("Appointment is null or undefined");
    }
  }



  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  handleSearchAppointments() {
    let kw = this.searchFormGroup?.value.keyword;
    if (!kw || kw === this.getCurrentDate()) {
      kw = this.getCurrentDate();
    }
    this.appointments = this.appointmentService.searchAppointments(kw).pipe(

      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  getCurrentTime(): string {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  // protected readonly async = async;
  /*getAppointments(): void {
    this.appointments = this.appointmentService.getAppointments().pipe(
      catchError(err => {
        console.error('Error fetching appointments:', err);
        return throwError(err);
      })
    );

    this.appointments.subscribe(appointments => {
      // Convertir chaque rendez-vous en un événement de calendrier
      this.calendarOptions = appointments.map(appointment => ({
        start: new Date(appointment.date + 'T' + appointment.time), // Combinez la date et l'heure
        title: appointment.reasonOfAppointment // Utilisez la raison du rendez-vous comme titre
        // Vous pouvez également inclure d'autres propriétés de l'événement ici, comme 'end'
      }));
    });
  }*/

  selectedStateOfIllness: string = '';
  selectStateOfPatients : string = '';


  protected readonly booleanAttribute = booleanAttribute;

  handleSearchByWeek() {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

    // Filtrer les rendez-vous pour la semaine en cours
    this.appointments = this.appointmentService.searchAppointmentsByWeek(firstDayOfWeek, lastDayOfWeek).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
  handleSearchByMonth() {
    const currentDate = new Date();
    const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Filtrer les rendez-vous pour le mois en cours
    this.appointments = this.appointmentService.searchAppointmentsByMonth(startMonth, endMonth).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
  handleSearchByYear() {
    const currentYear = new Date().getFullYear();

    // Filtrer les rendez-vous pour l'année en cours
    this.appointments = this.appointmentService.searchAppointmentsByYear(currentYear).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }




}
