import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { Section } from 'src/section/section.schema';
import {
  UserRights,
  UserRightsSchema,
} from 'src/shared/schemas/user-rights.schema';

export type ProjectDocument = Project & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Project {
  @Exclude()
  _id: ObjectId;
  @Exclude()
  __v: number;
  @Prop({ required: true })
  title: string;
  @Type(() => UserRights)
  @Prop({
    type: [UserRightsSchema],
    default: [],
    select: true,
  })
  users: UserRights[];
  @Prop({ default: Date.now() })
  createdDate: Date;

  @Transform(({ value }) => {
    value.map((sec) => {
      delete sec.project;
      return sec;
    });
    return value;
  })
  @Type(() => Section)
  sections: Section[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'project',
});
