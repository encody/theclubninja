import firebase from 'firebase';
import moment from 'moment';
import { Member } from './model/Member';
import { MemberType } from './model/MemberType';
import { Model } from './model/Model';
import { AttendanceType, AttendanceEvent } from './model/Attendance';
import { Membership } from './model/MemberTerm';

const model: Model = new Model({
  members: {
    doe500: new Member({
      name: 'John Doe on team',
      accountId: 'doe500',
      memberType: MemberType.Student,
      studentId: '123456789',
      graduationYear: 2020,
      referralMember: '',
      source: 'Advertisement',
      terms: {
        '2020_summer': {
          memberships: [Membership.Club, Membership.Team],
          ledger: [],
          attendance: [
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(17, 'hours').unix(),
                0,
              ),
              event: AttendanceEvent.Club,
              type: AttendanceType.Present,
            },
          ],
        },
      },
      waivers: [],
    }),
    doe501: new Member({
      name: 'Jane Doe on team',
      accountId: 'doe501',
      memberType: MemberType.Student,
      studentId: '123456780',
      graduationYear: 2020,
      referralMember: 'doe500',
      source: 'Advertisement',
      terms: {
        '2020_summer': {
          memberships: [Membership.Club, Membership.Team],
          ledger: [],
          attendance: [
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(17, 'days').unix(),
                0,
              ),
              event: AttendanceEvent.Team,
              type: AttendanceType.Present,
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(9, 'days').unix(),
                0,
              ),
              event: AttendanceEvent.Team,
              type: AttendanceType.Late,
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(7, 'days').unix(),
                0,
              ),
              event: AttendanceEvent.Team,
              type: AttendanceType.Unexcused,
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(2, 'days').unix(),
                0,
              ),
              event: AttendanceEvent.Team,
              type: AttendanceType.Excused,
            },
            {
              credit: null,
              timestamp: new firebase.firestore.Timestamp(
                moment().subtract(1, 'minutes').unix(),
                0,
              ),
              event: AttendanceEvent.Team,
              type: AttendanceType.Present,
            },
          ],
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
    }),
    shmo500: new Member({
      name: 'Joe Shmo not team',
      accountId: 'shmo500',
      memberType: MemberType.Other,
      studentId: '123456781',
      graduationYear: 2020,
      referralMember: '',
      source: 'Advertisement',
      terms: {
        '2020_summer': {
          memberships: [Membership.Club],
          ledger: [],
          attendance: [],
        },
      },
      waivers: [],
    }),
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
});

export default model;
