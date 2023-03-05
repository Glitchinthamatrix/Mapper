import express from "express";
import authControllers from "../controllers/auth.js";
import entityControllers from "../controllers/entity.js";

const router = express.Router();

router.route("/")
  .get(authControllers.authenticateUserAndPassId, entityControllers.getEntities);

export default router;
