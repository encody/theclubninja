import moment from 'moment';
import { Member } from './model/Member';
import { MemberTypeId } from './model/MemberType';

export const members: Member[] = [
  {
    name: 'John Doe on team',
    accountId: 'doe500',
    memberType: 'student',
    studentId: '123456789',
    isTeamMember: true,
    isActiveMember: true,
    graduationYear: 2020,
    referralMember: '',
    source: 'Advertisement',
    attendance: [],
    waivers: [],
  },
  {
    name: 'Jane Doe on team',
    accountId: 'doe501',
    memberType: 'student',
    studentId: '123456780',
    isTeamMember: true,
    isActiveMember: true,
    graduationYear: 2020,
    referralMember: 'doe500',
    source: 'Advertisement',
    attendance: [
      {
        credit: null,
        timestamp: moment().subtract(17, 'days').toDate(),
        type: 'present',
      },
      {
        credit: null,
        timestamp: moment().subtract(9, 'days').toDate(),
        type: 'late',
      },
      {
        credit: null,
        timestamp: moment().subtract(7, 'days').toDate(),
        type: 'unexcused',
      },
      {
        credit: null,
        timestamp: moment().subtract(2, 'days').toDate(),
        type: 'excused',
      },
      {
        credit: null,
        timestamp: moment().subtract(17, 'hours').toDate(),
        type: 'present',
      },
    ],
    waivers: [
      {
        timestamp: moment().subtract(5, 'days').toDate(),
      },
    ],
  },
  {
    name: 'Joe Shmo not team',
    accountId: 'shmo500',
    memberType: 'other',
    studentId: '123456781',
    isTeamMember: false,
    isActiveMember: true,
    graduationYear: 2020,
    referralMember: '',
    source: 'Advertisement',
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
