export interface IUserProfile {
  id: string;
  permissions: {
    terms: {
      write: boolean;
    };
    charges: {
      read: boolean;
      write: boolean;
    };
    members: {
      write: boolean;
    };
    types: {
      write: boolean;
    };
    users: {
      read: boolean;
      write: boolean;
    };
  };
}
