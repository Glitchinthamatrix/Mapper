import EntityModel from "../models/entityModel.js";
import User from "../models/user.js";
import { types, typeValidators } from "../utils/validation.js";

export default {
  async getEntityModels(req, res) {
    try {
      // this data will only be used for listing the models, don't need to send properties
      const models = await EntityModel.find(
        { creator: res.locals.user.id }, { creator: 0, properties: 0 }
      );
      res.status(200).json(models);
    } catch (e) {
      res.status(500).json({});
    }
  },

  async getEntityModel(req, res) {
    try {
      // this data will only be used for listing the models, don't need to send properties
      if (!typeValidators[types.mongooseId](req.params.modelId)){
        res.status(400).json({});
        return;
      }
      const models = await EntityModel.findOne({ _id: req.params.modelId });
      res.status(200).json(models);
    } catch (e) {
      res.status(500).json({});
    }
  },

  async addEntityModel(req, res) {
    try {
      const model = await EntityModel.create(
        { creator: res.locals.user.id, ...req.body }
      );
      const user = await User.findOne({ _id: res.locals.user.id });
      user.entityModels.push(model._id.toString());
      await user.save();
      res.status(200).json(model);
    } catch (e) {
      res.status(500).json({});
    }
  }
};
