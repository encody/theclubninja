import { IAttendance } from './Attendance';
import { ILedgerEntry } from './LedgerEntry';
import { Membership } from './Membership';
import { IPayment } from './Payment';

export interface IMemberTerm {
  memberships: Membership[];
  attendance: IAttendance[];
  ledger: ILedgerEntry[];
}
