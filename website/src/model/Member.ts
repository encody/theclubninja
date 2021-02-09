import { ICharge, isPaid } from './Charge';
import { IMemberTerm } from './MemberTerm';
import { IModel } from './Model';
import { IWaiver } from './Waiver';

export interface IMember {
  id: string;
  name: string;
  institutionId: string;
  memberType: string;
  email: string;
  graduationYear: number;
  source: string;
  referralMember: string;
  terms: { [termId: string]: IMemberTerm | undefined };
  waivers: IWaiver[];
}

export function hasPaidForTerm(
  member: IMember,
  chargeType: string,
  allCharges: IModel['charges'],
  termId: string,
): boolean {
  const term = member.terms[termId];
  if (!term) {
    return false;
  }

  return (
    term.ledger.length > 0 &&
    term.ledger
      .map(id => allCharges[id])
      .filter(c => !!c && c.chargeType === chargeType)
      .every(isPaid)
  );
}
export function getUnpaid(
  member: IMember,
  chargeType: string,
  allCharges: IModel['charges'],
  termId: string,
): ICharge[] {
  const term = member.terms[termId];
  if (!term) {
    return [];
  }

  const charges: ICharge[] = [];
  term.ledger.forEach(chargeId => {
    const charge = allCharges[chargeId];
    if (charge && charge.chargeType === chargeType && !isPaid(charge)) {
      charges.push(charge);
    }
  });

  return charges;
}

export function hasUnpaid(
  member: IMember,
  chargeType: string,
  allCharges: IModel['charges'],
  termId: string,
): boolean {
  const term = member.terms[termId];
  if (!term) {
    return false;
  }

  return term.ledger.some(chargeId => {
    const charge = allCharges[chargeId];
    return !!charge && charge.chargeType === chargeType && !isPaid(charge);
  });
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
