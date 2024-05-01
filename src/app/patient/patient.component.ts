import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {async, Observable, throwError} from "rxjs";
import {Patient} from "../model/patient.model";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PatientService} from "../services/patient.service";
import {Router} from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, map } from "rxjs/operators";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FamilySituation} from "../shared/enums/family-situation.enum";
@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit{

  patients !: Observable<Array<Patient>>;
  patient!: Patient;
  familySituations: string[] = Object.keys(FamilySituation).map(key => FamilySituation[key as keyof typeof FamilySituation]);
  errorMessage !: string;
  searchFormGroup !: FormGroup | undefined;
  closeResult!: string;
  newPatientFormGroup! :FormGroup;
  editPatientFormGroup!: FormGroup;
  @ViewChild('myModal') myModal!: TemplateRef<any>;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });
    this.handleSearchPatients();
    this.newPatientFormGroup = this.fb.group({
      firstName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      lastName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      cin : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      insuranceNumber : this.fb.control(null,[Validators.required]),
      dateOfBirth : this.fb.control(null,[Validators.required]),
      address : this.fb.control(null,[Validators.required]),
      email : this.fb.control(null,[Validators.required]),
      phone : this.fb.control(null,[Validators.required]),
      familySituation : this.fb.control('Select Family Situation',[Validators.required]),
    })
    this.editPatientFormGroup = this.fb.group({
      idPatient : this.fb.control(null),
      firstName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      lastName : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      cin : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      insuranceNumber : this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      dateOfBirth : this.fb.control(null,[Validators.required]),
      address : this.fb.control(null,[Validators.required]),
      email : this.fb.control(null,[Validators.required]),
      phone : this.fb.control(null,[Validators.required]),
      familySituation : this.fb.control(null,[Validators.required]),
    })
  }
  handleUpdatePatient(){
    let patient : Patient=this.editPatientFormGroup.value;
    this.patientService.updatePatient(patient).subscribe({
      next : value => {
        alert("Patient has been successfully updated ");
        this.ngOnInit();
        // this.router.navigateByUrl("/patients");
        //this.modalService.dismissAll();
      },error : err => {
        console.log(err);
      }
    });
  }
  handleSavePatient(){
    let patient : Patient=this.newPatientFormGroup.value;
    this.patientService.updatePatient(patient).subscribe({
      next : value => {
        alert("Patient has been successfully saved ");
        this.ngOnInit();
        // this.router.navigateByUrl("/patients");
        //this.modalService.dismissAll();
      },error : err => {
        console.log(err);
      }
    });
  }

  handleSearchPatients() {
    let kw = this.searchFormGroup?.value.keyword;
    this.patients = this.patientService.searchPatients(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )
  }

  handleDeletePatient(a: Patient) {
    let conf = confirm("Are you sure?");
    if (!conf) return;
    this.patientService.deletePatient(a.idPatient).subscribe({
      next: (resp) => {
        this.patients = this.patients.pipe(
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
  openDetails(targetModal: any, patient: Patient) {
    if (patient) {
      console.log(patient.cin);
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });

      // @ts-ignore
      document.getElementById('firstName0').setAttribute('value', patient.firstName);
      // @ts-ignore
      document.getElementById('lastName0').setAttribute('value', patient.lastName);
      // @ts-ignore
      document.getElementById('cin0').setAttribute('value', patient.cin);
      // @ts-ignore
      document.getElementById('insuranceNumber0').setAttribute('value', patient.insuranceNumber);
      // @ts-ignore
      document.getElementById('dateOfBirth0').setAttribute('value', patient.dateOfBirth);
      // @ts-ignore
      document.getElementById('address0').setAttribute('value', patient.address);
      // @ts-ignore
      document.getElementById('email0').setAttribute('value', patient.email);
      // @ts-ignore
      document.getElementById('phone0').setAttribute('value', patient.phone);
      // @ts-ignore
      document.getElementById('familySituation0').setAttribute('value', patient.familySituation);

    } else {
      console.error("Patient is null or undefined");
    }

  }



  openEdit(updatePatient: TemplateRef<any>, patient: Patient) {
    if (patient) {
      console.log(patient.cin);
      console.log("open updatePatient");

      this.modalService.open(updatePatient, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });
      this.editPatientFormGroup.patchValue( {
        idPatient: patient.idPatient,
        firstName: patient.firstName,
        lastName: patient.lastName,
        insuranceNumber: patient.insuranceNumber,
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
        email: patient.email,
        phone: patient.phone,
        familySituation: patient.familySituation
      });


    } else {
      console.error("Patient is null or undefined");
    }
  }

  protected readonly async = async;
}
