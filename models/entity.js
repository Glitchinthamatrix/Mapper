import mongoose from "mongoose";
import { relationship } from "./relationship.js";

const { Schema } = mongoose;

const entity = new Schema(
  {
    properties: {},
    relationships: { type: [ relationship ] }
  },
  { minimize: false, timestamps: true }
);

export default mongoose.model("Entity", entity);
