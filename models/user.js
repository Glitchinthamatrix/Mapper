import mongoose from "mongoose";

const { Schema } = mongoose;

const user = new Schema({
  name: {
    first: { type: String, required: [ true, "First name is required" ] },
    last: { type: String, default: null },
  },
  username: {
    type: String,
    required: [ true, "Username is required" ],
    unique: [ true, "Username must be unique" ]
  },
  email: {
    type:String, required: [ true, "Email is required" ],
    unique: [ true, "This email is already taoken" ]
  },
  password: { type: String, required: [ true, "Password is required" ] },
  // store models as [{id: <model-id>, instances: [<instance/entity id>]}]
  entityModels: {
    type: [ Schema.Types.ObjectId ],
    default: []
  },
  entities: { type: [ Schema.Types.ObjectId ], default: [] },
  definedRelationships: { type: [ String ], default: [] },
});

export default mongoose.model("User", user);
