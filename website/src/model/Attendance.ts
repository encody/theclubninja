import firebase from 'firebase';

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
  credit: string | null;
  type: AttendanceType;
  event: AttendanceEvent;
  timestamp: number;
  note: string;
}
