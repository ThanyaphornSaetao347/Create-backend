import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');
  
    const hashedPassword = await bcrypt.hash(dto.password, 10);
  
    // Create the user with the hashed password
    const userCreationResponse = await this.userService.createUser({
      email: dto.email,
      password: hashedPassword,
    });
  
    // Check if the user was created successfully
    if (userCreationResponse.data) {
      return {
        message: 'Registered successfully!',
        userId: userCreationResponse.data.user_id, // Access user_id from the 'data' property
      };
    } else {
      throw new ConflictException(userCreationResponse.message); // Handle error message if creation failed
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');
      
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Unvalid password');

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.user_id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
