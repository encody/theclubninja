import Attendance from './Attendance';
import Waiver from './Waiver';

export default interface Member {
  name: string;
  studentId: string;
  x500: string;
  isTeamMember: boolean;
  graduationYear: number;
  source: string;
  referral: string;
  attendance: Attendance[];
  waivers: Waiver[];
}
