import {IllnessState} from "../shared/enums/illnessState.enum";
import {PatientState} from "../shared/enums/PatientState.enum";
import {dateSelectionJoinTransformer} from "@fullcalendar/core/internal";

export interface Appointment {
  patientId: number;
  idAppointment: number;
  date: string;
  time: string;
  reasonOfAppointment: string;
  activationState: boolean;
  confirmation: boolean;
  stateOfIllness: IllnessState;
  stateOfPatient: PatientState;
}




