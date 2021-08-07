import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async create(input: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(input);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
