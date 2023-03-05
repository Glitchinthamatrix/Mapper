import User from "../models/user.js";
import Entity from "../models/entity.js";

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
};
