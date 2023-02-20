import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { RefType } from 'mongoose';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { NullInterceptor } from 'src/shared/interceptors/null-interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/objectid.pipe';
import { Role } from '../auth/enums/role.enum';
import { AccessTokenGuard } from '../auth/guards/acces-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import MongooseClassSerializerInterceptor from '../shared/interceptors/mongoSerializeInterceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { User, UserDocument } from './user.schema';
import { UsersService } from './users.service';

@UseInterceptors(
  new NullInterceptor('User'),
  MongooseClassSerializerInterceptor(User),
)
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findById(@Param('id', UserByIdPipe) user: UserDocument) {
    return user;
  }

  @Patch('/me')
  updateMe(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @CurrentUser() id: RefType,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', UserByIdPipe) id: RefType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: RefType) {
    return this.usersService.remove(id);
  }
}
