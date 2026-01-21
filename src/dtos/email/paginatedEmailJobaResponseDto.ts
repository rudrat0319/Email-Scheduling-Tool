import { emailJobRowDto } from './emailJobRowDto';

export interface paginatedEmailJobsResponseDto {
  data: emailJobRowDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}