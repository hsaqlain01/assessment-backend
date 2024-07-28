import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './auth/guard/local/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  createUser(@Body() createUserDto: UserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    try {
      return this.usersService.login(req.user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
