import { MemberTypeId } from './MemberType';
import { Waiver } from './Waiver';
import { MemberTerm } from './MemberTerm';

export interface Member {
  name: string;
  studentId: string;
  memberType: MemberTypeId;
  accountId: string;
  isTeamMember: boolean;
  isActiveMember: boolean;
  graduationYear: number;
  source: string;
  referralMember: string;
  memberTerms: { [termId: string]: MemberTerm | undefined };
  waivers: Waiver[];
}
