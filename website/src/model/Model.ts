import { CreditTypeId, ICreditType } from './CreditType';
import { Member } from './Member';
import { ITerm } from './Term';

export class Model {
  creditTypes: {
    [key in CreditTypeId]?: ICreditType;
  } = {};
  members: {
    [accountId: string]: Member;
  } = {};
  terms: ITerm[] = [];
}
