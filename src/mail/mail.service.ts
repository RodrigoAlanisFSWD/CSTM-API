import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/services/user/user.entity';

@Injectable()
export class MailService {
    constructor
    (
        private mailService: MailerService
    ) {}

    async sendUserConfirmation(user: User) {
        const url = `http://localhost:3000/confirm/${user.id}`

        await this.mailService.sendMail({
            to: user.email,
            subject: 'Welcome To CSTM! Please Confirm Your Email',
            template: './confirmation',
            context: {
                user,
                url
            }
        })
    }
}
