import {
  ClientSession,
  Document,
  FilterQuery,
  Model,
  MongooseBulkWriteOptions,
  PipelineStage,
  ProjectionType,
  Query,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import EventEmitter from 'events';
import { BaseTypeRepository } from './base.type.repository';
import {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
  DeleteResult,
} from 'mongodb';

export abstract class BaseAbstractRepository<T extends Document>
  implements BaseTypeRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: unknown): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async insertMany(data: unknown[]): Promise<T[]> {
    return this.model.insertMany(data);
  }

  async countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  findAll(
    filterQuery: FilterQuery<T>,
    projectionQuery?: ProjectionType<T>,
  ): Query<T[], T> {
    return this.model.find(filterQuery, projectionQuery);
  }

  findOne(
    filterQuery: FilterQuery<T>,
    projectionQuery?: ProjectionType<T>,
  ): Query<T | null, T> {
    return this.model.findOne(filterQuery, projectionQuery);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updatedData: UpdateQuery<unknown>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filterQuery, updatedData, options)
      .exec();
  }

  async updateMany(
    filterQuery: FilterQuery<T>,
    updatedData: UpdateQuery<unknown>,
    options?: QueryOptions<T>,
  ) {
    return this.model.updateMany(filterQuery, updatedData, options);
  }

  async deleteOne(
    filterQuery: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<Query<DeleteResult, T>> {
    return this.model.deleteOne(filterQuery, { session });
  }

  async deleteMany(
    filterQuery: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<Query<DeleteResult, T>> {
    return this.model.deleteMany(filterQuery, { session });
  }

  watch(): EventEmitter {
    return this.model.watch();
  }

  aggregate<T>(pipeline: PipelineStage[]): Promise<T[]> {
    return this.model.aggregate(pipeline).exec();
  }

  startSession(): Promise<ClientSession> {
    return this.model.startSession();
  }

  bulkWrite(
    bulkOps: Array<AnyBulkWriteOperation<any>>,
    options?: BulkWriteOptions & MongooseBulkWriteOptions & { ordered: false },
  ): Promise<BulkWriteResult & { mongoose?: { validationErrors: Error[] } }> {
    return this.model.bulkWrite(bulkOps, options);
  }
}
