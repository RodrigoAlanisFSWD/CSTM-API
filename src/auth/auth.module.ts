import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth/auth.service';
import { refreshProviders } from './services/auth/refresh.provider';
import { userProviders } from './services/user/user.provider';
import { UserService } from './services/user/user.service';
import { MailModule } from "../mail/mail.module"

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get("TOKEN_SECRET"),
        signOptions: { expiresIn: "30m" }
      }),
      inject: [ConfigService]
    }),
    MailModule
  ],
  providers: [UserService, AuthService, ...userProviders, ...refreshProviders, JwtStrategy],
  exports: [AuthService, UserService]
})
export class AuthModule { }
