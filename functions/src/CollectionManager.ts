import { IdCollection, IdRecord } from '../../website/src/model/IdRecord';

interface CollectionState<T extends IdRecord> {
  saved: IdCollection<T>;
  current: IdCollection<T>;
  update: IdCollection<T>;
}

export class CollectionManager {
  public static UPDATE_DELAY = 1000 * 30;

  private collections: Map<string, CollectionState<any>> = new Map();
  private dirty = false;
  public paused = false;

  constructor(private firestore: FirebaseFirestore.Firestore) {
    setInterval(() => {
      if (!this.paused) {
        console.log('Automatic pull/push attempt:');
        this.pull();
        this.push();
      }
    }, CollectionManager.UPDATE_DELAY);
  }

  private async retrieveCollection<T extends IdRecord>(
    collectionId: string,
  ): Promise<IdCollection<T>> {
    let query: FirebaseFirestore.Query = this.firestore.collection(
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
    console.log(`CollectionManager::get(${collectionId}):`);
    if (!this.collections.has(collectionId)) {
      console.log('Not in cache, requesting...');
      const saved = await this.retrieveCollection(collectionId);
      console.log('Received.');

      this.collections.set(collectionId, {
        saved,
        current: Object.assign({}, saved),
        update: {},
      });
    }

    console.log('Delivered.');
    return this.collections.get(collectionId)!.current;
  }

  public async set<T extends IdRecord>(
    collectionId: string,
    update: IdCollection<T>,
  ): Promise<IdCollection<T>> {
    console.log(
      `CollectionManager::set(${collectionId}, "${JSON.stringify(update)}"):`,
    );
    if (!this.collections.has(collectionId)) {
      await this.get(collectionId);
    }

    const collection = this.collections.get(collectionId)!;

    collection.current = Object.assign(collection.current, update);
    collection.update = Object.assign(collection.update, update);
    this.dirty = true;

    console.log('Done.');
    return collection.current;
  }

  public async push() {
    console.log(`CollectionManager::push():`);
    if (!this.dirty) {
      console.log('Not dirty, exiting.');
      return;
    }
    this.dirty = false;
    const b = this.firestore.batch();
    for (const [collectionId, state] of this.collections) {
      const updates = Object.entries(state.update);
      if (updates.length > 0) {
        for (const [id, record] of updates) {
          console.log(
            `Updating ${collectionId}: ${id} -> ${JSON.stringify(record)}`,
          );
          b.set(this.firestore.collection(collectionId).doc(id), record);
        }
      }
    }
    console.log('Committing...');
    await b.commit();
    for (const collection of this.collections.values()) {
      collection.saved = Object.assign({}, collection.current);
      collection.update = {};
    }
    console.log('Done.');
  }

  public async pull() {
    console.log('CollectionManager::pull():');
    await Promise.all(
      Array.from(this.collections.entries()).map(
        async ([collectionId, collection]) => {
          collection.saved = await this.retrieveCollection(collectionId);
          collection.current = Object.assign({}, collection.saved);
          const updates = Object.values(collection.update);
          for (const update of updates) {
            collection.current = Object.assign(collection.current, update);
          }
        },
      ),
    );
    console.log('Done.');
  }
}
