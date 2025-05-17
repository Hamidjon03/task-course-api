import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

/**
 * MongoDB database connection configuration
 * @returns MongooseModule
 */
export const connectToDatabase = () => {
  const logger = new Logger('DatabaseConnection');

  return MongooseModule.forRootAsync({
    useFactory: async (configService: ConfigService) => {
      // Get configuration from .env file
      const mongoUri = configService.get<string>('MONGO_URI');
      const dbName = configService.get<string>('DB_NAME');
      
      // Return database connection parameters
      return {
        uri: mongoUri,
        dbName: dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: (connection) => {
          // When connection is successful
          connection.on('connected', () => {
            logger.log(`Successfully connected to MongoDB database: ${connection.name}`);
          });
          
          // When disconnected
          connection.on('disconnected', () => {
            logger.warn(`Disconnected from MongoDB database: ${connection.name}`);
          });
          
          // When error occurs
          connection.on('error', (error) => {
            logger.error(`MongoDB connection error: ${error.message}`);
          });
          
          return connection;
        },
      };
    },
    inject: [ConfigService],
  });
};
