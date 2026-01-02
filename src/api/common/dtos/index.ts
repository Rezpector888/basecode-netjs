import { PAGINATION_CONSTANTS } from '@common/constant';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ default: PAGINATION_CONSTANTS.DEFAULT_PAGE })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = PAGINATION_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: PAGINATION_CONSTANTS.DEFAULT_LIMIT })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = PAGINATION_CONSTANTS.DEFAULT_LIMIT;
}
