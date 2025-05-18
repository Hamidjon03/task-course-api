import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create new user
    const newUser = new this.userModel(registerDto);
    const savedUser = await newUser.save();
    
    return {
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      }
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email with password included
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate token
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
