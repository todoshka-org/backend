import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AccessTokenGuard } from 'src/auth/guards/acces-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Rights } from 'src/shared/enums/rights.enum';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongoSerializeInterceptor';
import { NullInterceptor } from 'src/shared/interceptors/null-interceptor';
import { checkRights } from 'src/shared/utils/check-rights';
import { UserByIdPipe } from 'src/users/pipes/user-by-id.pipe';
import { UserDocument } from 'src/users/user.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { ParseRightsPipe } from './pipes/parse-rights.pipe';
import { ProjectByIdPipe } from './pipes/project-by-id.pipe';
import { Project, ProjectDocument } from './project.schema';
import { ProjectsService } from './projects.service';

@UseInterceptors(
  new NullInterceptor('Project'),
  MongooseClassSerializerInterceptor(Project),
)
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
    @CurrentUser() user: UserDocument,
  ) {
    const project = await this.projectsService.create(createProjectDto, user);
    return project.populate('users.user');
  }

  @Get()
  getProjects(@CurrentUser() user: UserDocument) {
    return this.projectsService.getUserProjects(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ProjectByIdPipe) project: ProjectDocument,
    @CurrentUser() currentUser: UserDocument,
  ) {
    if (!checkRights(project.users, currentUser)) {
      throw new ForbiddenException('You have no rights');
    }
    return project;
  }

  @Patch(':id/users')
  updateUserRights(
    @Param('id', ProjectByIdPipe) project: ProjectDocument,
    @Body('userId', UserByIdPipe) user: UserDocument,
    @Body('rights', ParseRightsPipe) rights: Rights[] = [],
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.projectsService.updateUserRights(
      project,
      user,
      rights,
      currentUser,
    );
  }

  @Post(':id/users')
  addUserToProject(
    @Param('id', ProjectByIdPipe) project: ProjectDocument,
    @Body('userId', UserByIdPipe) user: UserDocument,
    @Body('rights', ParseRightsPipe) rights: Rights[] = [],
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.projectsService.addUserToProject(
      project,
      user,
      rights,
      currentUser,
    );
  }

  @Delete(':id/users')
  removeUserFromProject(
    @Param('id', ProjectByIdPipe) id: ProjectDocument,
    @Body('userId', UserByIdPipe) user: UserDocument,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.projectsService.removeUserFromProject(id, user, currentUser);
  }

  @Delete(':id')
  deleteProject(
    @Param('id', ProjectByIdPipe) project: ProjectDocument,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.projectsService.deleteProject(project, currentUser);
  }
}
