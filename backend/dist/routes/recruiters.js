"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
router.get("/stats", middlewares_1.authenticateJwt, authControllers_1.stats);
exports.default = router;
