import { z } from 'zod';
import { PAGINATION } from '../../config/constants';

export const paginationQueryDto = z.object({
  page: z
    .string()
    .optional()
    .default(String(PAGINATION.DEFAULT_PAGE))
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().min(1, 'Page must be at least 1')),
  pageSize: z
    .string()
    .optional()
    .default(String(PAGINATION.DEFAULT_PAGE_SIZE))
    .transform(val => parseInt(val, 10))
    .pipe(
      z.number()
        .int()
        .min(1, 'Page size must be at least 1')
        .max(PAGINATION.MAX_PAGE_SIZE, `Page size cannot exceed ${PAGINATION.MAX_PAGE_SIZE}`)
    ),
});

export type PaginationQuery = z.infer<typeof paginationQueryDto>;