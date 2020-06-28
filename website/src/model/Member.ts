import { IWaiver } from './Waiver';
import { IMemberTerm, Membership } from './MemberTerm';
import { MemberType } from './MemberType';
import { AttendanceEvent } from './Attendance';
import { LedgerEntryReason } from './LedgerEntry';

export interface IMember {
  name: string;
  studentId: string;
  memberType: MemberType;
  accountId: string;
  graduationYear: number;
  source: string;
  referralMember: string;
  terms: { [termId: string]: IMemberTerm | undefined };
  waivers: IWaiver[];
}

export class Member {
  public constructor(public readonly data: IMember) {}

  public hasPaidForTerm(termId: string, reason: LedgerEntryReason): boolean {
    const term = this.data.terms[termId];
    if (!term) {
      return false;
    }

    const entries = term.ledger.filter(entry => entry.reason === reason);

    return (
      entries.length > 0 &&
      entries.every(
        entry =>
          entry.payments.reduce((total, p) => total + p.value, 0) ===
          entry.value,
      )
    );
  }

  public isActiveMember(termId: string): boolean {
    return !!this.data.terms[termId];
  }

  public hasMembership(membership: Membership, termId: string): boolean {
    const term = this.data.terms[termId];

    return !!term && term.memberships.includes(membership);
  }
}
