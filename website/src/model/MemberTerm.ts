import { IAttendance } from './Attendance';
import { ICharge } from './Charge';
import { Membership } from './Membership';
import { IPayment } from './Payment';

export interface IMemberTerm {
  memberships: Membership[];
  attendance: IAttendance[];
  ledger: ICharge[];
}
