import { CreditTypeId, ICreditType } from './CreditType';
import { IMember } from './Member';
import { ITerm } from './Term';

export interface IModel {
  creditTypes: {
    [key in CreditTypeId]?: ICreditType;
  };
  members: {
    [accountId: string]: IMember;
  };
  terms: ITerm[];
}

export function mostRecentTerm(model: IModel) {
  return model.terms[model.terms.length - 1];
}
