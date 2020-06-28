import { CreditTypeId, ICreditType } from './CreditType';
import { Member } from './Member';
import { ITerm } from './Term';

export interface IModel {
  creditTypes: {
    [key in CreditTypeId]?: ICreditType;
  };
  members: {
    [accountId: string]: Member;
  };
  terms: ITerm[];
}

export class Model {
  public constructor(public readonly data: IModel) {}

  public get mostRecentTerm(): ITerm {
    return this.data.terms[this.data.terms.length - 1];
  }
}
