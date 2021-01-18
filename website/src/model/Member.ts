import { ICharge, isPaid } from './Charge';
import { IMemberTerm } from './MemberTerm';
import { IWaiver } from './Waiver';

export interface IMember {
  name: string;
  institutionId: string;
  memberType: string;
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
  chargeType: string,
): boolean {
  const term = member.terms[termId];
  if (!term) {
    return false;
  }

  const charges = term.ledger.filter(
    charge => charge.chargeType === chargeType,
  );

  return charges.length > 0 && charges.every(isPaid);
}
export function getUnpaid(
  member: IMember,
  chargeType: string,
  termId: string,
): ICharge[] {
  const term = member.terms[termId];
  if (!term) {
    return [];
  }

  const charges = term.ledger.filter(
    charge => charge.chargeType === chargeType && !isPaid(charge),
  );

  return charges;
}

export function hasUnpaid(
  member: IMember,
  chargeType: string,
  termId: string,
): boolean {
  const term = member.terms[termId];
  if (!term) {
    return false;
  }

  const charges = term.ledger.filter(
    charge => charge.chargeType === chargeType,
  );

  return charges.length > 0 && charges.some(c => !isPaid(c));
}

export function isActiveMember(member: IMember, termId: string): boolean {
  return !!member.terms[termId];
}

export function hasMembership(
  member: IMember,
  membership: string,
  termId: string,
): boolean {
  const term = member.terms[termId];

  return !!term && term.memberships.includes(membership);
}
