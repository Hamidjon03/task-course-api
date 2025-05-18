import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../common/enums/user-role.enum';

async function bootstrap() {
  const logger = new Logger('Seed');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    // Check if admin already exists
    const adminEmail = 'admin@example.com';
    const existingAdmin = await usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      // Create admin user
      const admin = await usersService.create({
        name: 'Admin',
        email: adminEmail,
        password: 'password123',
        role: UserRole.ADMIN
      });

      logger.log('Admin user created successfully');
      logger.log(`Email: ${admin.email}`);
      logger.log('Password: admin123');
    } else {
      logger.log('Admin user already exists');
    }

    await app.close();
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

bootstrap();
