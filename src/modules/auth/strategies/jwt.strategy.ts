import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

  }

  async validate(payload: any) {
    try {

      const { sub: id } = payload;

      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }


      return {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      console.error('JWT validation error:', error.message);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
