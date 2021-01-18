import { IChargeType } from './ChargeType';
import { ICreditType } from './CreditType';
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
  members: {
    [accountId: string]: IMember;
  };
  terms: {
    [termId: string]: ITerm;
  };
}

export function mostRecentTerm(model: IModel) {
  const keys = Object.keys(model.terms);
  const result =
    model.terms[
      keys[
        keys
          .map(key => model.terms[key].start)
          .reduce(
            (bestIndex, currentStartTime, currentIndex, a) =>
              currentStartTime > a[bestIndex] ? currentIndex : bestIndex,
            0,
          )
      ]
    ];

  return result;
}
