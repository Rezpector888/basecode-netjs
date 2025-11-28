import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NoticationConsumer } from './notification.consumer';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notification'
        }),
    ],
    providers: [
        NoticationConsumer
    ]
})
export class NotificationModule {}
