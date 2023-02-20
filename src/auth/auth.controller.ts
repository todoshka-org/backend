import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtRefreshPayload } from './strategies/refresh-token.strategy';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signUp(@Body(ValidationPipe) user: SignupDto) {
    return this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signIn(@Body(ValidationPipe) user: SigninDto) {
    return this.authService.signIn(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/logout')
  logout(@CurrentUser() payload: JwtRefreshPayload) {
    return this.authService.logout(payload._id, payload.refreshToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@CurrentUser() payload: JwtRefreshPayload) {
    return this.authService.refreshTokens(payload._id, payload.refreshToken);
  }
}
