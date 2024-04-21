import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalstaffComponent } from './medicalstaff.component';

describe('MedicalstaffComponent', () => {
  let component: MedicalstaffComponent;
  let fixture: ComponentFixture<MedicalstaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalstaffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
