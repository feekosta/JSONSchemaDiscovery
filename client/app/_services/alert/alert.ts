export interface Alert {
  _id: string;
  batchId: string;
  userId: string;
  status: string;
  type: string;
  dbUri: string;
  collectionName: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
