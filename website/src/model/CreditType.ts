import firebase from 'firebase';

export const creditTypeConverter = {
  toFirestore(creditType: CreditType): firebase.firestore.DocumentData {
    return {
      name: creditType.name,
      limit: creditType.limit,
      order: creditType.order,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): CreditType {
    const data = snapshot.data(options) as FCreditType;
    return data;
  },
};

export type CreditTypeId = 'free';

export interface CreditType {
  name: string;
  limit: number;
  order: number;
}

export interface FCreditType {
  name: string;
  limit: number;
  order: number;
}
