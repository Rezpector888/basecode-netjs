import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start_date!: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end_date!: Date;
}
