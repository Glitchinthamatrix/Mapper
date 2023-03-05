import mongoose from "mongoose";
import { relationship } from "./relationship.js";

const { Schema } = mongoose;

const model = new Schema({
  creator: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [ true, "Name is required" ],
    unique: [ true, "Name must be unique" ]
  },
  properties: {},
  // store relationships as {<label>: [<entity-id>, <entity-id>]}
  defaultRelationships: { type: [ relationship ] },
}, { minimize: false, timestamps: true });

export default mongoose.model("Model", model);
