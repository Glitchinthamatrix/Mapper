import express from "express";
import authControllers from "../controllers/auth.js";
import entityControllers from "../controllers/entity.js";

const router = express.Router();

router.route("/")
  .get(authControllers.authenticateUserAndPassId, entityControllers.getEntities);

router.route("/:modelId")
  .post(authControllers.authenticateUserAndPassId, entityControllers.addEntity);

export default router;
