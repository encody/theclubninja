import { IAttendance } from './Attendance';
import { ILedgerEntry } from './LedgerEntry';
import { IPayment } from './Payment';

export enum Membership {
  Team = 'team_membership',
  Club = 'club_membership',
}

export interface IMemberTerm {
  memberships: Membership[];
  attendance: IAttendance[];
  ledger: ILedgerEntry[];
}
