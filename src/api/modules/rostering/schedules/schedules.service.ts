import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { createPaginator, PaginateFunction } from 'prisma-pagination';
import { PrismaAppService } from '@lib/prisma';
import { PAGINATION_CONSTANTS } from '@common/constant';
import { Prisma, schedules } from '@prisma-generated/prisma-app/client';

@Injectable()
export class SchedulesService {
  private paginate: PaginateFunction;
  constructor(readonly prismaApp: PrismaAppService) {
    this.paginate = createPaginator({
      page: PAGINATION_CONSTANTS.DEFAULT_PAGE,
      perPage: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    });
  }

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  async findAll() {
    const where: Prisma.schedulesWhereInput = {};
    return await this.paginate<schedules, Prisma.schedulesFindManyArgs>(this.prismaApp.schedules, {
      where,
      orderBy: { start_date: 'asc' },
    });
  }

  async findOne(id: string): Promise<Prisma.schedulesGetPayload<{}> | null> {
    return await this.prismaApp.schedules.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
