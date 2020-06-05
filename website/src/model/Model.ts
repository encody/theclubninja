import { CreditType, CreditTypeId } from './CreditType';
import { Member } from './Member';
import { MemberType, MemberTypeId } from './MemberType';
import { Term } from './Term';
import { getFirebase } from '../firebase';

export class Model {
  creditTypes: {
    [key in CreditTypeId]?: CreditType;
  } = {};
  memberTypes: {
    [key in MemberTypeId]?: MemberType;
  } = {};
  members: {
    [x500: string]: Member;
  } = {};
  terms: {
    [termId: string]: Term;
  } = {};
}
