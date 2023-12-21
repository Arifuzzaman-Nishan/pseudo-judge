import { Module } from '@nestjs/common';
import { ProblemsModule } from './problem/problem.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

const APP_FILTER = 'APP_FILTER';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    ProblemsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
