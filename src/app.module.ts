import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { connectToDatabase } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    connectToDatabase(),
    UserModule,
    AuthModule
  ],
})
export class AppModule {}
