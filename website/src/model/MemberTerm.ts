import { IAttendance } from './Attendance';

export interface IMemberTerm {
  memberships: string[];
  attendance: IAttendance[];
  ledger: string[];
}
