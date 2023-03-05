import mongoose from "mongoose";

const Schema = mongoose.Schema;

const relationship = new Schema({
  label: {
    type: String,
    required: true,
  },
  with: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  description: String,
});

export default mongoose.model("Relationship", relationship);
