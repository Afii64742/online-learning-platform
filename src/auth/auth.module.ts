import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modals/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import User entity
    ConfigModule, // Import ConfigModule to enable .env access
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],  // Ensure ConfigModule is available
      inject: [ConfigService],  // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get secret from .env
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService],   // ✅ Export if used in other modules
})
export class AuthModule {}
