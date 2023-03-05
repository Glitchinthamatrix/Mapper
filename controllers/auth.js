import User from "../models/user.js";
import { getDecryptedToken, getSessionTokenFromUserId } from "../libs/JWT.js";
import sessionStore from "../sessions.js";

export default {
  async register(req, res) {
    try {
      const user = await User.create(req.body);
      const userIdString = user._id.toString();
      const token = getSessionTokenFromUserId(userIdString);
      sessionStore.setSession(userIdString, getDecryptedToken(token));
      res.status(200).json({ token: token });
    } catch (e) {
      res.status(500).json(e);
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const userId = user._id.toString();

      if (user.password !== req.body.password){
        res.status(422).json({ password: [ "Incorrect password" ] });
        return;
      }
      if (sessionStore.sessionExists(userId)){
        res.status(400).json({});
        return;
      }
      const token = getSessionTokenFromUserId(userId);
      // Reset session with every login request or block login requests
      // if a (not expired) session already exists
      sessionStore.setSession(userId, getDecryptedToken(token));
      res.status(200).json({ token: token });
    } catch (e) {
      res.status(500).json(e);
    }
  },

  authenticateUserAndPassId(req, res, next) {
    try {
      // TODO: encrypt the user passsword for more security?
      const token = req.headers["authorization"];
      const userObject = getDecryptedToken(token);
      let isAuthorized = false;
      const MESSAGE_UNAUTHORIZED = "Unauthorized access, please login";
      if (userObject !== null){
        if (sessionStore.isValidSession(userObject.userId, userObject.iat, userObject.exp)){
          // token stores expiryTime in number of seconds since unix epoch
          isAuthorized = true;
        } else if (sessionStore.sessionExists(userObject.userId)) {
          sessionStore.deleteSession(userObject.userId);
        }
      }
      if (isAuthorized){
        res.locals.user = { id: userObject.userId };
        next();
      } else {
        res.status(401).json({ message:  MESSAGE_UNAUTHORIZED });
      }
    } catch (e){
      res.status(500).json({});
    }
  },

  logout(req, res) {
    try {
      sessionStore.deleteSession(res.locals.user.id);
      res.status(200).json({});
    } catch (e) {
      res.status(500).json({});
    }
  }
};
