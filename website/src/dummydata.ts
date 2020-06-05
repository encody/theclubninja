import moment from 'moment';
import { Member } from './model/Member';
import { MemberTypeId } from './model/MemberType';

export const members: Member[] = [
  {
    name: 'John Doe on team',
    x500: 'doe500',
    memberType: 'student',
    studentId: '123456789',
    isTeamMember: true,
    graduationYear: 2020,
    referralMember: '',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [],
  },
  {
    name: 'Jane Doe on team',
    x500: 'doe501',
    memberType: 'student',
    studentId: '123456780',
    isTeamMember: true,
    graduationYear: 2020,
    referralMember: 'doe500',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [
      {
        timestamp: moment().subtract(5, 'days').toDate(),
      },
    ],
  },
  {
    name: 'Joe Shmo not team',
    x500: 'shmo500',
    memberType: 'other',
    studentId: '123456781',
    isTeamMember: false,
    graduationYear: 2020,
    referralMember: '',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [],
  },
];

export const memberTypes: { [key in MemberTypeId]: { name: string } } = {
  student: {
    name: 'Student',
  },
  alumni: {
    name: 'Alumni',
  },
  faculty_staff: {
    name: 'Faculty/Staff',
  },
  other: {
    name: 'Other',
  },
};
