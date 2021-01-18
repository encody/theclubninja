export enum AttendanceType {
  Present = 'present',
  Late = 'late',
  Excused = 'excused',
  Unexcused = 'unexcused',
}

export interface IAttendance {
  credit: string | null;
  type: AttendanceType;
  event: string;
  timestamp: number;
  note: string;
}
