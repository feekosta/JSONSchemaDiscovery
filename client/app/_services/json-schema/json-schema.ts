export interface RawSchemaBatch {
  __id: string;
  userId: string;
  collectionName: string;
  dbUri: string;
  collectionCount: number;
  uniqueUnorderedCount: number;
  uniqueOrderedCount: number;
  status: string;
  statusMessage: string;
  statusType: string;
  reduceType: string;
  startDate: Date;
  extractionDate: Date;
  extractionElapsedTime: number;
  unorderedMapReduceDate: Date;
  unorderedMapReduceElapsedTime: number;
  orderedMapReduceDate: Date;
  orderedMapReduceElapsedTime: number;
  unorderedAggregationDate: Date;
  unorderedAggregationElapsedTime: number;
  orderedAggregationDate: Date;
  orderedAggregationElapsedTime: number;
  unionDate: Date;
  unionElapsedTime: number;
  endDate: Date;
  totalElapsedTime: number;
  rawSchemaFormat: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface JsonSchemaExtracted {
  batchId: string;
  jsonSchema: string;
  createdAt: Date;
}
