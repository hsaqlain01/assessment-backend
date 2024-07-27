import { SelectQueryBuilder } from 'typeorm';

export class CommonRepository {
  static getUserByField(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: any,
  ) {
    return queryBuilder.where(`users.${field} = :value`, {
      value,
    });
  }
}
