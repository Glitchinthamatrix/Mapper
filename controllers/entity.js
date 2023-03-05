import EntityModel from "../models/entityModel.js";
import User from "../models/user.js";

export default {
  async getEntities(req, res) {
    try {
      const user = await User.findOne({ _id: res.locals.user.id });
      const entities = await EntityModel.find({ _id: { $in: user.entityModels } });
      res.status(200).json(entities);
    } catch (e) {
      res.status(500).json({});
    }
  },

  async getEntityModels(req, res) {
    try {
      const models = await EntityModel.find({ creator: res.locals.user.id });
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
