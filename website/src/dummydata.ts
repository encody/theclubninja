import firebase from 'firebase';
import moment from 'moment';
import { Model } from './model/Model';

const model: Model = {
  members: {
    'doe500': {
      name: 'John Doe on team',
      accountId: 'doe500',
      memberType: 'student',
      studentId: '123456789',
      isTeamMember: true,
      isActiveMember: true,
      graduationYear: 2020,
      referralMember: '',
      source: 'Advertisement',
      memberTerms: {
        '2020_summer': {
          hasPaidClubDues: false,
          hasPaidTeamDues: false,
          bills: [],
          payments: [],
          teamAttendance: [],
          clubAttendance: [
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(17, 'hours').unix(),
                0,
              ),
              type: 'present',
            },
          ],
        },
      },
      waivers: [],
    },
    'doe501': {
      name: 'Jane Doe on team',
      accountId: 'doe501',
      memberType: 'student',
      studentId: '123456780',
      isTeamMember: true,
      isActiveMember: true,
      graduationYear: 2020,
      referralMember: 'doe500',
      source: 'Advertisement',
      memberTerms: {
        '2020_summer': {
          hasPaidClubDues: false,
          hasPaidTeamDues: false,
          bills: [],
          payments: [],
          teamAttendance: [
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(17, 'days').unix(),
                0,
              ),
              type: 'present',
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(9, 'days').unix(),
                0,
              ),
              type: 'late',
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(7, 'days').unix(),
                0,
              ),
              type: 'unexcused',
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(2, 'days').unix(),
                0,
              ),
              type: 'excused',
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(17, 'hours').unix(),
                0,
              ),
              type: 'present',
            },
          ],
          clubAttendance: [],
        },
      },
      waivers: [
        {
          timestamp: new firebase.firestore.Timestamp(
            moment().subtract(5, 'days').unix(),
            0,
          ),
        },
      ],
    },
    'shmo500': {
      name: 'Joe Shmo not team',
      accountId: 'shmo500',
      memberType: 'other',
      studentId: '123456781',
      isTeamMember: false,
      isActiveMember: true,
      graduationYear: 2020,
      referralMember: '',
      source: 'Advertisement',
      memberTerms: {
        '2020_summer': {
          bills: [],
          clubAttendance: [],
          teamAttendance: [],
          hasPaidClubDues: false,
          hasPaidTeamDues: false,
          payments: [],
        },
      },
      waivers: [],
    },
  },
  memberTypes: {
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
  },
  terms: [
    {
      id: '2020_spring',
      start: new firebase.firestore.Timestamp(moment('2020-06-01').unix(), 0),
      end: new firebase.firestore.Timestamp(moment('2020-01-01').unix(), 0),
      name: 'Spring 2020',
    },
    {
      id: '2020_summer',
      start: new firebase.firestore.Timestamp(moment('2020-06-01').unix(), 0),
      end: new firebase.firestore.Timestamp(moment('2020-09-01').unix(), 0),
      name: 'Summer 2020',
    },
  ],
  creditTypes: {
    free: {
      name: 'Free Lesson',
      limit: 2,
      order: 0,
    },
  },
};

export default model;
