import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fid: number;
  notificationUrl: string;
  notificationToken: string;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  fid: { type: Number, required: true, unique: true },
  notificationUrl: { type: String, required: true },
  notificationToken: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);