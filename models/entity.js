import mongoose from "mongoose";

const { Schema } = mongoose;

const entity = new Schema({}, { timestamps: true });

export default mongoose.model("Entity", entity);
