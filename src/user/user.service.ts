import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> { // create user
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existing) {
      return {
        code: '2',
        message: 'สร้างผู้ใช้ไม่สำเร็จ มีชื่อผู้ใช้นี้ในระบบแล้ว',
      };
    }

    // ควรเข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
    });
    
    const result = await this.userRepository.save(user);

    return {
      code: '1',
      message: 'บันทึกสำเร็จ',
      data: {
        user_id: result.user_id,
        username: result.username
      },
    };
  }

  async createUser(userData: { email: string; password: string; username?: string }) {
    const existing = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existing) {
      return {
        code: '2',
        message: 'สมัครไม่สำเร็จ มีอีเมลนี้ในระบบแล้ว',
      };
    }

    const user = this.userRepository.create(userData);
    const result = await this.userRepository.save(user);

    return {
      code: '1',
      message: 'บันทึกสำเร็จ',
      data: {
        user_id: result.user_id,
        email: result.email,
      },
    };
  }

  findAll(filter: {username?: string; password?: string}) {
    const where: any = {};

    if (filter.username) {
      where.username = Like(`%${filter.username}%`);
    }

    if (filter.password) {
      where.password = Like(`%${filter.password}%`);
    }
    
    return this.userRepository.find({ where });
  }

  findOne(user_id: number) {
    return this.userRepository.findOneBy({ user_id });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    // ถ้ามีการอัปเดตรหัสผ่าน ให้เข้ารหัสก่อน
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    await this.userRepository.update(user_id, updateUserDto);
    return this.findOne(user_id);
  }

  remove(user_id: number) {
    return this.userRepository.delete(user_id);
  }
}