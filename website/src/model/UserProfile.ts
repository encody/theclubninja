export interface IUserProfile {
  id: string;
  permissions: {
    terms: {
      write: boolean;
    };
    ledger: {
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
