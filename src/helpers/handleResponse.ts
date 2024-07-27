import { CommonDtos } from 'src/common/dto';
import { responseCode } from './responseCode';
import { responseMessage } from './responseMessage';

export interface ApiResponse<T> {
  status: number;
  result: boolean;
  message: string;
  data: T;
  token?: string;
}

export const handleData = <T>(
  data: T,
  status: number = responseCode.OK,
  message: string = responseMessage.SUCCESS,
  token?: string,
): ApiResponse<T> => {
  return {
    status,
    result: true,
    message,
    data,
    token,
  };
};

export const paginatedResponse = (
  totalRecords: number,
  query: CommonDtos.PaginationInput,
  data: any,
) => {
  return {
    totalRecords,
    page: Number(query.page) ?? 1,
    limit: Number(query.limit) ?? 10,
    totalPages: Math.ceil(totalRecords / query.limit || 10),
    currentRecords: data?.length,
  };
};
