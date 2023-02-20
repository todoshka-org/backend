import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { RefType } from 'mongoose';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AccessTokenGuard } from 'src/auth/guards/acces-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProjectByIdPipe } from 'src/projects/pipes/project-by-id.pipe';
import { ProjectDocument } from 'src/projects/project.schema';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongoSerializeInterceptor';
import { UserDocument } from 'src/users/user.schema';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './section.schema';
import { SectionsService } from './sections.service';

@UseInterceptors(MongooseClassSerializerInterceptor(Section))
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionService: SectionsService) {}

  @Post()
  create(
    @CurrentUser() currentUser: UserDocument,
    @Body(ValidationPipe) createSectionDto: CreateSectionDto,
    @Body('project', ProjectByIdPipe)
    project: ProjectDocument,
  ) {
    return this.sectionService.create(createSectionDto, project, currentUser);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: RefType, @CurrentUser() user: UserDocument) {
    return this.sectionService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: RefType) {
    return this.sectionService.remove(id);
  }
}
