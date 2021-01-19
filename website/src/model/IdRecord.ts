export interface IdRecord {
  id: string;
}

export interface IdCollection<T extends IdRecord> {
  [id: string]: T;
}
