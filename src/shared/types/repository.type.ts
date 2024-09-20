import {
    Attributes,
    CreateOptions,
    CreationAttributes,
    FindOptions,
    Model,
    UpdateOptions,
    DestroyOptions,
    WhereOptions,
    BulkCreateOptions,
    CountOptions,
    FindAndCountOptions,
  } from 'sequelize';
  
export type FindOptionsType<M extends Model<M>> = FindOptions<Attributes<M>>;

export type CreateOptionsType<M extends Model<M>> = CreateOptions<
  Attributes<M>
>;

export type CreateType<M extends Model<M>> = CreationAttributes<M>;

export type UpdateOptionType<M extends Model<M>> = UpdateOptions<Attributes<M>>;

export type DestroyOptionsType<M extends Model<M>> = DestroyOptions<
  Attributes<M>
>;

export type WhereType<M extends Model<M>> = WhereOptions<Attributes<M>>;

export type UpdateOptionWithReturnType<M extends Model> = Omit<
  UpdateOptionType<M>,
  'returning'
> & {
  returning: Exclude<UpdateOptionType<M>['returning'], undefined | false>;
};

export type FindAndCountOptionsType<M extends Model<M>> = FindAndCountOptions<
  Attributes<M>
>;
