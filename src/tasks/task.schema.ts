import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Project } from 'src/projects/project.schema';
import { User } from 'src/users/user.schema';

export type TaskDocument = Task & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Task {
  @Exclude()
  _id: string;
  @Exclude()
  __v: number;
  @Type(() => Project)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: User;
  @Prop()
  title: string;
  @Prop()
  body: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
