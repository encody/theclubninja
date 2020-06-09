import firebase from 'firebase';
import moment from 'moment';
import { Attendance, FAttendance } from './Attendance';
import { MemberTypeId } from './MemberType';
import { FWaiver, Waiver } from './Waiver';

export const memberConverter: firebase.firestore.FirestoreDataConverter<Member> = {
  toFirestore(modelObject: Member) {
    return {
      attendance: modelObject.attendance.map(
        a =>
          ({
            credit: a.credit,
            timestamp: new firebase.firestore.Timestamp(
              moment(a.timestamp).unix(),
              0,
            ),
          } as FAttendance),
      ),
      graduationYear: modelObject.graduationYear,
      isTeamMember: modelObject.isTeamMember,
      memberType: modelObject.memberType,
      name: modelObject.name,
      referralMember: modelObject.referralMember,
      source: modelObject.source,
      studentId: modelObject.studentId,
      waivers: modelObject.waivers.map(
        w =>
          ({
            timestamp: new firebase.firestore.Timestamp(
              moment(w.timestamp).unix(),
              0,
            ),
          } as FWaiver),
      ),
      accountId: modelObject.accountId,
    } as FMember;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as FMember;
    return {
      attendance: data.attendance.map(
        a =>
          ({
            credit: a.credit,
            timestamp: a.timestamp.toDate(),
          } as Attendance),
      ),
      graduationYear: data.graduationYear,
      isTeamMember: data.isTeamMember,
      isActiveMember: data.isActiveMember,
      memberType: data.memberType,
      name: data.name,
      referralMember: data.referralMember,
      source: data.source,
      studentId: data.studentId,
      waivers: data.waivers.map(
        w =>
          ({
            timestamp: w.timestamp.toDate(),
          } as Waiver),
      ),
      accountId: data.accountId,
    };
  },
};

export interface Member {
  name: string;
  studentId: string;
  memberType: MemberTypeId;
  accountId: string;
  isTeamMember: boolean;
  isActiveMember: boolean;
  graduationYear: number;
  source: string;
  referralMember: string;
  attendance: Attendance[];
  waivers: Waiver[];
}

export interface FMember {
  name: string;
  studentId: string;
  memberType: MemberTypeId;
  accountId: string;
  isTeamMember: boolean;
  isActiveMember: boolean;
  graduationYear: number;
  source: MemberTypeId;
  referralMember: string;
  attendance: FAttendance[];
  waivers: FWaiver[];
}
