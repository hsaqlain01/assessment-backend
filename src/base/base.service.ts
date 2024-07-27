import { TransactionScope } from './transactionScope';
import { Injectable } from '@nestjs/common';
@Injectable()
export abstract class BaseService {
  protected getTransactionScope(): TransactionScope {
    return new TransactionScope();
  }
}
