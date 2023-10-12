import mongoose, { Schema } from 'mongoose';

const albumSchema = new Schema(
  {
    title: { type: String, required: true },
    images: [String],
  },
  { timestamps: true }
);

const Album = mongoose.model('Album', albumSchema);

export default Album;
