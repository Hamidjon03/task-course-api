import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { UserRole } from 'src/common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  })
  email: string;

  @Prop({
    required: true,
    select: false
  })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Course', default: [] })
  registeredCourses: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (this: any, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Remove version from response
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
