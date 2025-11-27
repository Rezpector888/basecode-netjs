import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SchedulesModule } from './schedules';

@Module({
  imports: [
    SchedulesModule,
    RouterModule.register([
      {
        path: 'rostering',
        children: [
          {
            path: 'schedules',
            module: SchedulesModule,
          },
        ],
      },
    ]),
  ],
})
export class RosteringModule {}
