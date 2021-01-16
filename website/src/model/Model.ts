import { ICreditType } from './CreditType';
import { IMember } from './Member';
import { ITerm } from './Term';

export interface IModel {
  creditTypes: {
    [id: string]: ICreditType;
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
