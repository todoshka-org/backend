import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RefType } from 'mongoose';
import { ProjectDocument } from 'src/projects/project.schema';
import { Rights } from 'src/shared/enums/rights.enum';
import { checkRights } from 'src/shared/utils/check-rights';
import { UserDocument } from 'src/users/user.schema';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section, SectionDocument } from './section.schema';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
  ) {}

  async create(
    createSectionDto: CreateSectionDto,
    project: ProjectDocument,
    currentUser: UserDocument,
  ) {
    const right = checkRights(project.users, currentUser, [
      Rights.CREATE,
      Rights.OWNER,
    ]);

    if (!right) {
      throw new ForbiddenException('You have no rights');
    }

    const section = await this.sectionModel.create(createSectionDto);
    return section.populate({
      path: 'project',
      populate: {
        path: 'users.user',
      },
    });
  }

  findAll() {
    return `This action returns all section`;
  }

  async findOne(id: RefType, currentUser: UserDocument) {
    const section = await this.sectionModel.findById(id).populate({
      path: 'project',
      populate: {
        path: 'users.user',
      },
    });

    if (!checkRights(section.project.users, currentUser)) {
      throw new ForbiddenException('You have no rights');
    }

    return section;
  }

  remove(id: RefType) {
    return `This action removes a #${id} section`;
  }
}
