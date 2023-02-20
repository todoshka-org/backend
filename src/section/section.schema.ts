import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose, { Document, isObjectIdOrHexString } from 'mongoose';
import { Project } from 'src/projects/project.schema';

export type SectionDocument = Section & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Section {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Type((type) => {
    if (isObjectIdOrHexString(type.object.user)) return String;
    return Project;
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  project: Project;
  @Prop()
  title: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
