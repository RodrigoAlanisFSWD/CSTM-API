import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { MailService } from 'src/mail/mail.service';
import { JwtAuthGuard } from './auth.guard';
import { UserDto } from './dto/auth.dto';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private mailService: MailService
    ) { }

    @Post('register')
    async register(@Body() userDto: UserDto): Promise<Object> {
        try {
            const user = await this.userService.create(userDto);
            const token = await this.authService.generateJwt(user);
            const refresh = await this.authService.generateRefresh(user);
            await this.authService.registerRefresh(refresh, user);

            this.mailService.sendUserConfirmation(user);

            return {
                res: 100,
                token,
                refresh,
            };
        } catch (error) {
            return {
                res: error.code,
                error: error.msg,
                token: null,
            };
        }
    }

    @Post('login')
    async login(@Body() userDto: UserDto): Promise<Object> {
        const user = await this.userService.findOne({
            username: userDto.username
        })

        if (!user) {
            return {
                res: 101,
                error: "The Password Or The Username Are Invalid",
                token: null,
            };
        }

        const validate = await this.userService.validatePassword(userDto.password, user)

        if (!validate) {
            return {
                res: 101,
                error: "The Password Or The Username Are Invalid",
                token: null,
            };
        }

        const token = await this.authService.generateJwt(user);
        const oldRefresh = (await this.userService.getRefresh(user)).refresh;
        const refresh = await this.authService.generateRefresh(user);
        this.authService.updateRefresh(oldRefresh, refresh);

        return {
            res: 100,
            token,
            refresh,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get("account")
    async account(@Request() req) {
        const user = await this.userService.findOne({
            id: req.user.id
        })

        return {
            res: 100,
            account: user,
        }
    }

    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: "./uploads",
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }))

    @UseGuards(JwtAuthGuard)
    @Post("avatar")
    async avatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const user = await this.userService.findOne({ id: req.user.id })
        await this.userService.uploadAvatar(file, user)

        return {
            res: 100,
            msg: "avatar uploaded"
        }
    }
}
