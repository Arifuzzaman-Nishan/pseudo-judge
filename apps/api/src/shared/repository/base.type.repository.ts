import {
  FilterQuery,
  PipelineStage,
  ProjectionType,
  UpdateQuery,
} from 'mongoose';
import EventEmitter from 'events';

export type BaseTypeRepository<T> = {
  create(data: unknown): Promise<T>;

  countDocuments(filter: FilterQuery<T>): Promise<number>;

  findAll(
    filterQuery: FilterQuery<T>,
    projectionQuery?: ProjectionType<T>,
  ): Promise<T[]>;

  findOne(
    filterQuery: FilterQuery<T>,
    projectionQuery?: ProjectionType<T>,
  ): Promise<T | null>;

  findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updatedData: UpdateQuery<unknown>,
  ): Promise<T | null>;

  deleteOne(filterQuery: FilterQuery<T>);

  deleteMany(filterQuery: FilterQuery<T>);

  watch(): EventEmitter;

  aggregate(pipeline: PipelineStage[]): Promise<T[]>;
};
