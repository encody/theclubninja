import Member from './model/Member';

export const members: Member[] = [
  {
    name: 'John Doe on team',
    x500: 'doe500',
    studentId: '123456789',
    isTeamMember: true,
    attendance: [],
    waivers: [],
  },
  {
    name: 'Jane Doe on team',
    x500: 'doe501',
    studentId: '123456780',
    isTeamMember: true,
    attendance: [],
    waivers: [],
  },
  {
    name: 'Joe Shmo not team',
    x500: 'shmo500',
    studentId: '123456781',
    isTeamMember: false,
    attendance: [],
    waivers: [],
  },
];
