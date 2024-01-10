import { Module } from '@nestjs/common';
import { ProblemsModule } from './problem/problem.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import path from 'path';

const APP_FILTER = 'APP_FILTER';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        `../../../env/.env.${process.env.NODE_ENV}`,
      ),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProblemsModule,
    GroupModule,
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
