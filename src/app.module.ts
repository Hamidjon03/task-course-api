import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Use MongooseModule with async configuration to connect to MongoDB
    // This integrates with NestJS lifecycle and DI system
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // MongoDB connection string from .env
      }),
    }),

    // Import feature modules
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    // Listen for mongoose connection events and log status
    mongoose.connection.on('connected', () => {
      this.logger.log(`Connected to MongoDB: ${mongoose.connection.name}`);
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.warn(`Disconnected from MongoDB`);
    });

    mongoose.connection.on('error', (error) => {
      this.logger.error(`MongoDB connection error: ${error.message}`);
    });
  }
}
