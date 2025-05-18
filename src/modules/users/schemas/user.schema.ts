import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for email
UserSchema.index({ email: 1 });

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
