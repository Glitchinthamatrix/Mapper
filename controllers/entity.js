import User from "../models/user.js";
import Entity from "../models/entity.js";
import Model from "../models/entityModel.js";
import { typeValidators, types, _schemaEnforcer } from "../utils/validation.js";

export default {
  async getEntities(req, res) {
    try {
      const user = await User.findOne({ _id: res.locals.user.id });
      const entities = await Entity.find({ _id: { $in: user.entities } }, { creator: 0 });
      res.status(200).json(entities);
    } catch (e) {
      res.status(500).json({});
    }
  },

  async addEntity(req, res) {
    try {
      if (!typeValidators[types.mongooseId](req.params.modelId)){
        res.status(400).json({});
        return;
      }
      const entityModel = await Model.findOne({ _id: req.params.modelId });
      const errors = {};
      await _schemaEnforcer(
        {
          properties: entityModel.properties,
          requestBody: req.body,
          errors: errors,
          Collection: Entity
        }
      );
      if (Object.keys(errors).length === 0){
        const entity = await Entity.create({ properties: req.body });
        res.status(200).json(entity);
      } else {
        res.status(422).json(errors);
      }
    } catch (e) {
      res.status(500).json({});
    }
  },
};
