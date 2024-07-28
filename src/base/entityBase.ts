import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { cloneDeep } from 'lodash';

class EntityBase {
  public id: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date;

  @Exclude()
  public entitySnapshot?;

  loadSnapshotForPartialUpdate?() {
    this.entitySnapshot = cloneDeep(this);
  }

  public getPropertiesToUpdate?() {
    const snapshot = this.entitySnapshot;
    const propertiesToIgnore = ['createdAt', 'updatedAt'];
    const updatedProperties = {};
    const keys = Object.keys(this).filter(
      (key) => !propertiesToIgnore.includes(key)
    );

    for (const key of keys) {
      if (this[key] instanceof Array && this[key].length) {
        continue;
      }
      if (
        this[key] instanceof Date &&
        this[key].valueOf() === snapshot[key]?.valueOf()
      ) {
        continue;
      }

      if (this[key] instanceof Array) {
        updatedProperties[key] = this[key];
      } else {
        updatedProperties[key] = this[key];
        snapshot[key] = this[key];
      }
    }
    return updatedProperties;
  }

  constructor(entityBase?: Partial<EntityBase>) {
    if (entityBase) {
      Object.assign(this, entityBase);
    }
  }
}

export { EntityBase };
