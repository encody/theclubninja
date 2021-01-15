import firebase from 'firebase';
import moment from 'moment';
import { IMember } from './model/Member';
import { MemberType } from './model/MemberType';
import { IModel } from './model/Model';
import { AttendanceType, AttendanceEvent } from './model/Attendance';
import { Membership } from './model/MemberTerm';
import { LedgerEntryReason } from './model/LedgerEntry';
import { PaymentType } from './model/Payment';

const model: IModel = {
  members: {
    doe500: {
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
          ledger: [
            {
              reason: LedgerEntryReason.ClubDues,
              term: '2020_summer',
              value: 40,
              note: '',
              payments: [
                {
                  timestamp: moment().subtract(1, 'days').unix(),
                  type: PaymentType.Manual,
                  value: 40,
                },
              ],
              start: moment().subtract(7, 'days').unix(),
              end: moment().add(7, 'days').unix(),
            },
          ],
          attendance: [
            {
              credit: null,
              timestamp: moment().subtract(17, 'hours').unix(),
              event: AttendanceEvent.Club,
              type: AttendanceType.Present,
            },
          ],
        },
      },
      waivers: [],
    },
    doe501: {
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
          ledger: [
            {
              reason: LedgerEntryReason.TeamDues,
              term: '2020_summer',
              value: 210,
              note: '',
              payments: [],
              start: moment().subtract(14, 'days').unix(),
              end: moment().subtract(7, 'days').unix(),
            },
            {
              reason: LedgerEntryReason.TeamDues,
              term: '2020_summer',
              value: 210,
              note: '',
              payments: [],
              start: moment().subtract(7, 'days').unix(),
              end: moment().add(7, 'days').unix(),
            },
            {
              reason: LedgerEntryReason.TeamDues,
              term: '2020_summer',
              value: 210,
              note: '',
              payments: [
                {
                  timestamp: moment().subtract(1, 'days').unix(),
                  type: PaymentType.Manual,
                  value: 210,
                },
              ],
              start: moment().subtract(7, 'days').unix(),
              end: moment().add(7, 'days').unix(),
            },
            {
              reason: LedgerEntryReason.TeamDues,
              term: '2020_summer',
              value: 210,
              note: '',
              payments: [
                {
                  timestamp: moment().subtract(1, 'days').unix(),
                  type: PaymentType.Manual,
                  enteredByUserId: 'admin_id_here',
                  value: 90,
                },
                {
                  timestamp: moment().subtract(1, 'days').unix(),
                  type: PaymentType.Online,
                  reference: '1234567890',
                  value: 80,
                },
              ],
              start: moment().subtract(7, 'days').unix(),
              end: moment().add(7, 'days').unix(),
            },
          ],
          attendance: [
            {
              credit: null,
              timestamp: moment().subtract(17, 'days').unix(),
              event: AttendanceEvent.Team,
              type: AttendanceType.Present,
            },
            {
              credit: null,
              timestamp: moment().subtract(9, 'days').unix(),
              event: AttendanceEvent.Team,
              type: AttendanceType.Late,
            },
            {
              credit: null,
              timestamp: moment().subtract(7, 'days').unix(),
              event: AttendanceEvent.Team,
              type: AttendanceType.Unexcused,
            },
            {
              credit: null,
              timestamp: moment().subtract(2, 'days').unix(),
              event: AttendanceEvent.Team,
              type: AttendanceType.Excused,
            },
            {
              credit: null,
              timestamp: moment().subtract(1, 'minutes').unix(),
              event: AttendanceEvent.Team,
              type: AttendanceType.Present,
            },
          ],
        },
      },
      waivers: [
        {
          timestamp: moment().subtract(5, 'days').unix(),
        },
      ],
    },
    shmo500: {
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
    },
    shmo501: {
      name: 'This is another test',
      accountId: 'shmo501',
      memberType: MemberType.Student,
      studentId: '84295488',
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
    },
    shmo502: {
      name: 'fabulous man',
      accountId: 'shmo502',
      memberType: MemberType.Student,
      studentId: '2345789',
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
    },
  },
  terms: {
    '2020_spring': {
      id: '2020_spring',
      start: moment('2020-06-01').unix(),
      end: moment('2020-01-01').unix(),
      name: 'Spring 2020',
    },
    '2020_summer': {
      id: '2020_summer',
      start: moment('2020-06-01').unix(),
      end: moment('2020-09-01').unix(),
      name: 'Summer 2020',
    },
  },
  creditTypes: {
    free: {
      name: 'Free Lesson',
      limit: 2,
      order: 0,
    },
  },
};

export default model;
