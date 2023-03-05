import express from "express";
import authControllers from "../controllers/auth.js";
import entityModelControllers from "../controllers/entityModel.js";
import {
  GENERIC_NAME_TO_DATA_TYPE,
  ENTITY_MODEL_CLAUSES,
  REGEX_PATTERNS_FOR_CLIENT,
  validateSchemaObject
} from "../utils/validation.js";

const router = express.Router();

router.route("/")
  .get(authControllers.authenticateUserAndPassId, entityModelControllers.getEntityModels)
  .post(
    authControllers.authenticateUserAndPassId,
    validateSchemaObject,
    entityModelControllers.addEntityModel
  );

router.route("/:modelId")
  .get(authControllers.authenticateUserAndPassId, entityModelControllers.getEntityModel);

router.route("/data-types")
  .get(authControllers.authenticateUserAndPassId,
    (_, res) => res.status(200).json(GENERIC_NAME_TO_DATA_TYPE)
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
