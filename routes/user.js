import express from "express";
import authControllers from "../controllers/auth.js";
import userController from "../controllers/user.js";

const router = express.Router();

router.route("/me").get(authControllers.authenticateUserAndPassId, userController.getUserFromToken);

export default router;
