import { IAttendance } from './Attendance';
import { ICharge } from './Charge';

export interface IMemberTerm {
  memberships: string[];
  attendance: IAttendance[];
  ledger: ICharge[];
}
