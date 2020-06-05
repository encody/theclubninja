import { FAttendance, Attendance } from './Attendance';
import { FWaiver, Waiver } from './Waiver';

export type MemberType = 'student' | 'alumni' | 'faculty_staff' | 'other';

export interface Member {
  name: string;
  studentId: string;
  memberType: MemberType;
  x500: string;
  isTeamMember: boolean;
  graduationYear: number;
  source: string;
  referralMember: string;
  attendance: Attendance[];
  waivers: Waiver[];
}

export interface FMember {
  name: string;
  studentId: string;
  memberType: firebase.firestore.DocumentReference;
  x500: string;
  isTeamMember: boolean;
  graduationYear: number;
  source: firebase.firestore.DocumentReference;
  referral: string;
  attendance: FAttendance[];
  waivers: FWaiver[];
}
