import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path/posix';
import { MailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("MAIL_HOST"),
          auth: {
            user: config.get("MAIL_USER"),
            pass: config.get("MAIL_PASSWORD")
          }
        },
        defaults: {
          from: `"CSTM" <${config.get("MAIL_FROM")}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter(),
        }

      }),
      inject: [ConfigService],
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
