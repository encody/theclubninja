export interface IMembership {
  id: string;
  duesId: string;
  default: boolean;
  name: string;
  order: number;
  useDetailedAttendance: boolean;
  canUseCredit: boolean;
  slug: string;
}
