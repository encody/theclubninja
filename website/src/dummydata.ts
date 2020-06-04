import Member from './model/Member';
import firebase from 'firebase';
import moment from 'moment';

export const members: Member[] = [
  {
    name: 'John Doe on team',
    x500: 'doe500',
    studentId: '123456789',
    isTeamMember: true,
    graduationYear: 2020,
    referral: '',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [],
  },
  {
    name: 'Jane Doe on team',
    x500: 'doe501',
    studentId: '123456780',
    isTeamMember: true,
    graduationYear: 2020,
    referral: 'doe500',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [
      {
        timestamp: new firebase.firestore.Timestamp(moment().subtract(5, 'days').unix(), 0),
      },
    ],
  },
  {
    name: 'Joe Shmo not team',
    x500: 'shmo500',
    studentId: '123456781',
    isTeamMember: false,
    graduationYear: 2020,
    referral: '',
    source: 'Mural on the bridge',
    attendance: [],
    waivers: [],
  },
];
