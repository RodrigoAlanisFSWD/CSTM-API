import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Refresh } from '../auth/refresh.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async create(userDto: UserDto): Promise<User> {
        try {
            const password = await bcrypt.hash(userDto.password, 5);
            const user = this.userRepository.create({
                ...userDto,
                password,
            });

            return this.userRepository.save(user);
        } catch (error) {
            throw { code: 101, msg: 'Email Or Username Already Exists' };
        }
    }

    async validatePassword(password: string, user: User): Promise<Boolean> {
        return bcrypt.compare(password, user.password)
    }

    async findOne(query: Object): Promise<User> {
        return this.userRepository.findOne(query)
    }

    async saveRefresh(refresh: Refresh, user: User) {
        user.refresh = refresh;

        await this.userRepository.save(user)
    }

    async getRefresh(user: User): Promise<User> {
        return await this.userRepository.findOne(user.id, {
            relations: ["refresh"]
        })
    }

    async uploadAvatar(file: Express.Multer.File, user: User) {
       user.avatar = file.originalname
       await this.userRepository.save(user) 
    }
}
