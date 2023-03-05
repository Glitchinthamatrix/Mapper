import express from "express";
import authControllers from "../controllers/auth.js";
import { signUpBodyEnforcer, loginBodyEnforcer } from "../schema-enforcers/user.js";

const router = express.Router();

router.route("/register").post(signUpBodyEnforcer, authControllers.register);

router.route("/login").post(loginBodyEnforcer, authControllers.login);

router.route("/logout").post(authControllers.authenticateUserAndPassId, authControllers.logout);

export default router;
