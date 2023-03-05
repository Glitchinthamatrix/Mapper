import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const relationship = new Schema({
  label: {
    type: String,
    required: true,
  },
  with: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  description: String,
}, { timestamps: true });

export default mongoose.model("Relationship", relationship);
