import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/shared/pipes/objectid.pipe';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectByIdPipe
  extends ParseObjectIdPipe
  implements PipeTransform<string>
{
  constructor(private readonly projectService: ProjectsService) {
    super();
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    super.transform(value, metadata);
    const project = await this.projectService
      .findById(value)
      .populate('users.user sections');
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }
}
