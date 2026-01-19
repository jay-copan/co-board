import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

type JwtPayload = {
  sub?: string;
  email?: string;
  role: 'admin' | 'user';
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(
    email: string,
    password: string,
    role: 'admin' | 'user' = 'user',
  ): Promise<UserDocument> {
    const hashed = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashed,
      role,
    });

    return user.save();
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const sadminEmail = this.configService.get<string>('SADMIN_EMAIL');
    const sadminPassword = this.configService.get<string>('SADMIN_PASSWORD');

    if (
      sadminEmail &&
      sadminPassword &&
      email === sadminEmail &&
      password === sadminPassword
    ) {
      const payload: JwtPayload = {
        email,
        role: 'admin',
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
