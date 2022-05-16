export interface IUserProfile {
  id: string;
  email?: string;
  _name?: string;
  name?: string;
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

export const FULL_PERMISSIONS: IUserProfile['permissions'] = {
  terms: {
    write: true,
  },
  charges: {
    read: true,
    write: true,
  },
  members: {
    write: true,
  },
  types: {
    write: true,
  },
  users: {
    read: true,
    write: true,
  },
};

export const NO_PERMISSIONS: IUserProfile['permissions'] = {
  terms: {
    write: false,
  },
  charges: {
    read: false,
    write: false,
  },
  members: {
    write: false,
  },
  types: {
    write: false,
  },
  users: {
    read: false,
    write: false,
  },
};
