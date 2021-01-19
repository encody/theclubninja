import { ICharge } from './Charge';
import { IChargeType } from './ChargeType';
import { ICreditType } from './CreditType';
import { IdCollection } from './IdRecord';
import { IMember } from './Member';
import { IMembership } from './Membership';
import { IMemberType } from './MemberType';
import { ITerm } from './Term';

export interface IModel {
  chargeTypes: {
    [id: string]: IChargeType;
  };
  creditTypes: {
    [id: string]: ICreditType;
  };
  memberTypes: {
    [id: string]: IMemberType;
  };
  memberships: {
    [id: string]: IMembership;
  };
  charges: {
    [id: string]: ICharge;
  };
  members: {
    [accountId: string]: IMember;
  };
  terms: {
    [termId: string]: ITerm;
  };
}

export function mostRecentTerm(terms: IdCollection<ITerm>) {
  const keys = Object.keys(terms);
  const result =
    terms[
      keys[
        keys
          .map(key => terms[key].start)
          .reduce(
            (bestIndex, currentStartTime, currentIndex, a) =>
              currentStartTime > a[bestIndex] ? currentIndex : bestIndex,
            0,
          )
      ]
    ];

  return result;
}
