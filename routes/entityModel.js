import express from "express";
import authControllers from "../controllers/auth.js";
import entityControllers from "../controllers/entity.js";
import {
  DATA_TYPES_TO_GENERIC_NAMES,
  ENTITY_MODEL_CLAUSES,
  REGEX_PATTERNS_FOR_CLIENT,
  validateSchemaObject
} from "../utils/validation.js";

const router = express.Router();

router.route("/")
  .get(authControllers.authenticateUserAndPassId, entityControllers.getEntityModels)
  .post(
    authControllers.authenticateUserAndPassId,
    validateSchemaObject,
    entityControllers.addEntityModel
  );

router.route("/data-types")
  .get(authControllers.authenticateUserAndPassId,
    (_, res) => res.status(200).json(DATA_TYPES_TO_GENERIC_NAMES)
  );

router.route("/clauses")
  .get(authControllers.authenticateUserAndPassId,
    (_, res) => res.status(200).json(ENTITY_MODEL_CLAUSES)
  );

router.route("/regex-patterns")
  .get(authControllers.authenticateUserAndPassId,
    (_, res) => {
      res.status(200).json(REGEX_PATTERNS_FOR_CLIENT);
    }
  );
export default router;
