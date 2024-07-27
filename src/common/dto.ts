export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_OFFSET = 1;

export namespace CommonDtos {
  export class PaginationInput {
    limit: number = DEFAULT_PAGE_LIMIT;
    page: number = DEFAULT_PAGE_OFFSET;
  }
}
