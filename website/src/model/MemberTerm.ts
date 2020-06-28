import { IAttendance } from './Attendance';
import { ILedgerEntry } from './LedgerEntry';
import { IPayment } from './Payment';

export interface IMemberTerm {
  attendance: IAttendance[];
  ledger: ILedgerEntry[];
}
