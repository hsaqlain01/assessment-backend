import { CommonDtos } from 'src/common/dto';
import { responseMessage } from './responseMessage';
import { HttpCode, HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  status: number;
  result: boolean;
  message: string;
  data: T;
  token?: string;
}

export const handleData = <T>(
  data: T,
  message: string = responseMessage.SUCCESS,
  status: number = HttpStatus.OK
): ApiResponse<T> => {
  return {
    status,
    result: true,
    message,
    data,
  };
};

export const paginatedResponse = <T>(
  totalRecords: number,
  query: CommonDtos.PaginationInput,
  data: T[]
) => {
  return {
    totalRecords,
    page: Number(query.page) ?? 1,
    limit: Number(query.limit) ?? 10,
    totalPages: Math.ceil(totalRecords / query.limit || 10),
    currentRecords: data?.length,
  };
};
