import { isPaid, LedgerEntryReason } from './LedgerEntry';
import { IMemberTerm } from './MemberTerm';
import { Membership } from "./Membership";
import { MemberType } from './MemberType';
import { IWaiver } from './Waiver';

export interface IMember {
  name: string;
  institutionId: string;
  memberType: MemberType;
  accountId: string;
  graduationYear: number;
  source: string;
  referralMember: string;
  terms: { [termId: string]: IMemberTerm | undefined };
  waivers: IWaiver[];
}

export function hasPaidForTerm(
  member: IMember,
  termId: string,
  reason: LedgerEntryReason,
): boolean {
  const term = member.terms[termId];
  if (!term) {
    return false;
  }

  const entries = term.ledger.filter(entry => entry.reason === reason);

  return entries.length > 0 && entries.every(isPaid);
}

export function isActiveMember(member: IMember, termId: string): boolean {
  return !!member.terms[termId];
}

export function hasMembership(
  member: IMember,
  membership: Membership,
  termId: string,
): boolean {
  const term = member.terms[termId];

  return !!term && term.memberships.includes(membership);
}
