import { IdCollection, IdRecord } from '../../website/src/model/IdRecord';

export class CollectionManager {
  constructor(private firestore: FirebaseFirestore.Firestore) {}

  private async retrieveCollection<T extends IdRecord>(
    collectionId: string,
  ): Promise<IdCollection<T>> {
    const query: FirebaseFirestore.Query = this.firestore.collection(
      collectionId,
    );
    return (await query.get()).docs.reduce(
      (acc, doc) => ({ ...acc, [doc.id]: doc.data() as T }),
      {} as IdCollection<T>,
    );
  }

  public async get<T extends IdRecord>(
    collectionId: string,
  ): Promise<IdCollection<T>> {
    return await this.retrieveCollection(collectionId);
  }

  public async set<T extends IdRecord>(
    collectionId: string,
    update: IdCollection<T>,
  ): Promise<boolean> {
    try {
      const updates = Object.entries(update);
      const b = this.firestore.batch();
      if (updates.length > 0) {
        for (const [id, record] of updates) {
          b.set(this.firestore.collection(collectionId).doc(id), record);
        }
      }
      await b.commit();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
