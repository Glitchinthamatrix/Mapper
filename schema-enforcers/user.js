import { schemaEnforcer, types } from "../utils/validation.js";
import User from "../models/user.js";

const signUpBodyProperties = {
  username: { type: types.string, required: true, unique: true },
  name: {
    first: { type: types.string, required: true },
    last: { type: types.string },
  },
  email: { type: types.string, required: true, pattern: "email", unique: true },
  password: { type: types.string, required: true }
};

const loginBodyProperties = {
  email: { type: types.string, required: true, mustExist: true, pattern: "email" },
  password: { type: types.string, required: true }
};

export const signUpBodyEnforcer =
 (req, res, next) => schemaEnforcer(
   { req, res, next, properties: signUpBodyProperties, Model: User }
 );

export const loginBodyEnforcer =
 (req, res, next) => schemaEnforcer(
   { req, res, next, properties: loginBodyProperties, Model: User }
 );

