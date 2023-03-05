import User from "../models/user.js";

export default {
  async getEntities(req, res) {
    try {
      const user = await User.findOne({ _id: res.locals.user.id }).populate([ "entityModels" ]);
      res.status(200).json(user.entityModels);
    } catch (e) {
      res.status(500).json({});
    }
  },
};
