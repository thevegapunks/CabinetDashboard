import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {FormBuilder, FormGroup,ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Appointment} from "../model/appointment.model";
import {IllnessState} from "../shared/enums/illnessState.enum";
import {PatientState} from "../shared/enums/PatientState.enum";
import {catchError, map} from "rxjs/operators";
import {AppointmentService} from "../services/appointment.service";
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

    this.handleSearchAppointments();
    this.newAppointmentFormGroup = this.fb.group({
      date: this.fb.control(new Date(),[Validators.required]),
      time : this.fb.control(null,[Validators.required]),
      reasonOfAppointment : this.fb.control(null,[Validators.required]),
      activationState : this.fb.control(null,[Validators.required]),
      confirmation : this.fb.control(null,[Validators.required]),
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
        this.ngOnInit();
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
      // console.log(appointment.reasonOfAppointment);
      console.log("open updatePatient");

      this.modalService.open(updateAppointment, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });
      this.editAppointmentFormGroup.patchValue( {
        idPatient: appointment.idAppointment,
        date: appointment.date,
        time: appointment.time,
        reasonOfAppointment: appointment.reasonOfAppointment,
        activationState: appointment.activationState,
        confirmation: appointment.confirmation,
        stateOfIllness: appointment.stateOfIllness,
        stateOfPatient: appointment.stateOfPatient
      });


    } else {
      console.error("Appointment is null or undefined");
    }
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    // Format the date as YYYY-MM-DD
    return currentDate.toISOString().substring(0, 10);
  }
  handleSearchAppointments() {
    let kw = this.searchFormGroup?.value.keyword;
    if (kw==null){
      kw: [this.getCurrentDate(), [Validators.required]]
    }
    this.appointments = this.appointmentService.searchAppointments(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )
  }
  // protected readonly async = async;
}
