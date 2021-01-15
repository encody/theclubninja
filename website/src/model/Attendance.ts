import firebase from 'firebase';
import { CreditTypeId } from './CreditType';

export enum AttendanceType {
  Present = 'present',
  Late = 'late',
  Excused = 'excused',
  Unexcused = 'unexcused',
}

export enum AttendanceEvent {
  Club = 'club',
  Team = 'team',
}

export interface IAttendance {
  credit: CreditTypeId | null;
  type: AttendanceType;
  event: AttendanceEvent;
  timestamp: number;
}
