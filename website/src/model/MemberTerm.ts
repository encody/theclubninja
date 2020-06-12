import { Attendance } from './Attendance';
import { Bill } from './Bill';
import { Payment } from './Payment';

export interface MemberTerm {
  hasPaidTeamDues: boolean;
  hasPaidClubDues: boolean;
  teamAttendance: Attendance[];
  clubAttendance: Attendance[];
  bills: Bill[];
  payments: Payment[];
}
