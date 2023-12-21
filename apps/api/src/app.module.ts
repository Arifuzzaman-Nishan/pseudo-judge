import { Module } from '@nestjs/common';
import { ProblemsModule } from './problem/problem.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

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
  providers: [],
})
export class AppModule {}
