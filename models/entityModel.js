import mongoose from "mongoose";

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
  relationships: {
    type: [ { label: String, with: mongoose.Types.ObjectId } ]
  }
}, { minimize: false });

export default mongoose.model("Model", model);
