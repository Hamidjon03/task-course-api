import { MongooseModule } from '@nestjs/mongoose';

export const connectToDatabase = () =>
  MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/nest-task-course');
