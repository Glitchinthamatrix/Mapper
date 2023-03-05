import mongoose from "mongoose";

const { Schema } = mongoose;

const entity = new Schema({});

export default mongoose.model("Entity", entity);
