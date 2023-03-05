import express from "express";

const router = express.Router();

router.route("/").post((req, res) => res.status.json());

export default router;
