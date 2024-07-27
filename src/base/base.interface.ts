export enum objectState {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  HARD_DELETE = 'hard_delete',
  BULK_INSERT = 'bulk_insert',
}

export interface IRawQuery {
  query: string;
  parameters: any[];
}

export enum HookType {
  AFTER_COMMIT = 'AFTER_COMMIT',
}
