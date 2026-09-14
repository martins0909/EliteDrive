import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  url: string;
  thumbnail?: string;
  order: number;
}

const VideoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model<IVideo>('Video', VideoSchema);
