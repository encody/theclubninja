import firebase from 'firebase';
import moment from 'moment';

export const termConverter: firebase.firestore.FirestoreDataConverter<Term> = {
  toFirestore(modelObject) {
    return {
      name: modelObject.name,
      start: new firebase.firestore.Timestamp(
        moment(modelObject.start).unix(),
        0,
      ),
      end: new firebase.firestore.Timestamp(moment(modelObject.end).unix(), 0),
    } as FTerm;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as FTerm;
    return {
      name: data.name,
      start: data.start.toDate(),
      end: data.end ? data.end.toDate() : null,
    };
  },
};

export interface Term {
  name: string;
  start: Date;
  end: Date | null;
}

export interface FTerm {
  name: string;
  start: firebase.firestore.Timestamp;
  end: firebase.firestore.Timestamp | null;
}
