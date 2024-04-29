import {FamilySituation} from "../shared/enums/family-situation.enum";

export interface Patient {
  idPatient: number;
  firstName: string;
  lastName: string;
  cin: string;
  insuranceNumber: string;
  dateOfBirth: string;
  address: string;
  email: string;
  phone: string;
  familySituation: FamilySituation;
}
