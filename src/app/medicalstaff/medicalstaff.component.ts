import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {async, Observable, throwError } from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MedicalStaff } from '../model/medicalstaff.model';
import { MedicalStaffService } from '../services/medicalstaff.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map } from 'rxjs/operators';
import { StaffRole } from '../shared/enums/staffRole.enum';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-medical-staff',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './medicalstaff.component.html',
  styleUrls: ['./medicalstaff.component.css']
})
export class MedicalstaffComponent implements OnInit {

  medicalStaffs!:  Observable<Array<MedicalStaff>>;
  medicalStaff!: MedicalStaff;
  staffRole: string[] = Object.keys(StaffRole).map(key => StaffRole[key as keyof typeof StaffRole]);
  errorMessage!: string;
  searchFormGroup!: FormGroup | undefined;
  closeResult!: string;
  newMedicalStaffFormGroup!: FormGroup;
  editMedicalStaffFormGroup!: FormGroup;
  @ViewChild('myModal') myModal!: TemplateRef<any>;

  constructor(
    private medicalStaffService: MedicalStaffService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });
    this.handleSearchMedicalStaffs();

    this.newMedicalStaffFormGroup = this.fb.group({
      firstName: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      lastName: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      cin: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      address: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      phone: this.fb.control(null, [Validators.required]),
      staffRole: this.fb.control('Select Staff Role', [Validators.required]),
    });

    this.editMedicalStaffFormGroup = this.fb.group({
      id: this.fb.control(null),
      firstName: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      lastName: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      cin: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      address: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      phone: this.fb.control(null, [Validators.required]),
      staffRole: this.fb.control(null, [Validators.required]),
    });
  }
  handleAllMedicalStaffs() {
    this.medicalStaffs = this.medicalStaffService.getAllMedicalStaffs().pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  handleUpdateMedicalStaff() {
    let medicalStaff: MedicalStaff = this.editMedicalStaffFormGroup.value;
    this.medicalStaffService.updateMedicalStaff(medicalStaff).subscribe({
      next: value => {
        alert('Medical staff has been successfully updated');
        this.ngOnInit();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  handleSaveMedicalStaff() {
    let medicalStaff: MedicalStaff = this.newMedicalStaffFormGroup.value;
    this.medicalStaffService.saveMedicalStaff(medicalStaff).subscribe({
      next: value => {
        alert('Medical staff has been successfully saved');
        this.ngOnInit();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  handleSearchMedicalStaffs() {
    let kw = this.searchFormGroup?.value.keyword;
    this.medicalStaffs = this.medicalStaffService.searchMedicalStaffs(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }
  handleDeleteMedicalStaff(a: MedicalStaff) {
    let confirmation = confirm('Are you sure?');
    if (!confirmation) return;

    this.medicalStaffService.deleteMedicalStaff(a.id).subscribe({
      next: (resp) => {
        this.medicalStaffs = this.medicalStaffs.pipe(
          map((data: MedicalStaff[]) => {
            return data.filter(staff => staff.id !== a.id);
          })
        );
      },
      error: err => {
        console.log(err);
      }
    });
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
  openDetails(targetModal: any, staff: MedicalStaff) {
    if (staff) {
      console.log(staff.cin);
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });

      // @ts-ignore
      document.getElementById('firstName0').setAttribute('value', staff.firstName);
      // @ts-ignore
      document.getElementById('lastName0').setAttribute('value', staff.lastName);
      // @ts-ignore
      document.getElementById('cin0').setAttribute('value', staff.cin);
      // @ts-ignore
      document.getElementById('address0').setAttribute('value', staff.address);
      // @ts-ignore
      document.getElementById('email0').setAttribute('value', staff.email);
      // @ts-ignore
      document.getElementById('phone0').setAttribute('value', staff.phone);
      // @ts-ignore
      document.getElementById('staffRole0').setAttribute('value', staff.staffRole);

    } else {
      console.error("Medical staff is null or undefined");
    }
  }

  openEdit(updateStaff: TemplateRef<any>, staff: MedicalStaff) {
    if (staff) {
      console.log(staff.cin);
      console.log("open updateStaff");

      this.modalService.open(updateStaff, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
      });
      this.editMedicalStaffFormGroup.patchValue( {
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        cin : staff.cin,
        address: staff.address,
        email: staff.email,
        phone: staff.phone,
        staffRole: staff.staffRole
      });


    } else {
      console.error("Medical staff is null or undefined");
    }
  }
  protected readonly async = async ;
  selectedStaffRole: string = '';

}
