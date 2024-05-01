import {IllnessState} from "../shared/enums/illnessState.enum";
import {PatientState} from "../shared/enums/PatientState.enum";

export interface Appointment {
  idAppointment: number;
  date: string;
  time: string;
  reasonOfAppointment: string;
  activationState: boolean;
  confirmation: boolean;
  stateOfIllness: IllnessState;
  stateOfPatient: PatientState;
}




