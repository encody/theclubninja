export enum MemberType {
  Student = 'student',
  Alumni = 'alumni',
  FacultyStaff = 'faculty_staff',
  Other = 'other',
}

interface MemberTypeInformation {
  name: string;
}

export const memberTypes: {
  [memberType in MemberType]: MemberTypeInformation;
} = {
  student: {
    name: 'Student',
  },
  alumni: {
    name: 'Alumni',
  },
  faculty_staff: {
    name: 'Faculty/Staff',
  },
  other: {
    name: 'Other',
  },
};
