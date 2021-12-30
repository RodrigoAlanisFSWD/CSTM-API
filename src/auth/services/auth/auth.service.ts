import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Refresh } from './refresh.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @Inject("REFRESH_REPOSITORY")
        private refreshRepository: Repository<Refresh>,
        private userService: UserService,
        private jwtService: JwtService,
        private config: ConfigService
    ) {}

    async generateJwt(user: User): Promise<string> {
        return this.jwtService.signAsync({id: user.id})
    }

    async generateRefresh(user: User): Promise<string> {
        return jwt.sign({"id": user.id}, this.config.get("REFRESH_SECRET"), {
            expiresIn: "360h"
        })
    }

    async updateRefresh(refresh: Refresh, newRefresh: string) {
        refresh.token = newRefresh;
        await this.refreshRepository.save(refresh)
    }j

    async registerRefresh(token: string, user: User): Promise<Refresh> {
        let refresh = this.refreshRepository.create({
            token,
        })

        refresh = await this.refreshRepository.save(refresh)

        await this.userService.saveRefresh(refresh, user)

        return refresh
    }

}
