import User from "../models/user.js";
import { getDecryptedToken } from "../libs/JWT.js";

export default {
  async getUserFromToken(req, res) {
    try {
      const userId = getDecryptedToken(req.headers["authorization"]).userId;
      const user = await User.findOne({ _id: userId });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({});
    }
  }
};
