import Attendance from './Attendance';
import Waiver from './Waiver';

export default interface Member {
  name: string;
  studentId: string;
  x500: string;
  isTeamMember: boolean;
  attendance: Attendance[];
  waivers: Waiver[];
}
