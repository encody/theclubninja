export interface AuthResponse {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string;
  };
  tokensValidAfterTime: string;
  providerData: {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    providerId: string;
  }[];
}
