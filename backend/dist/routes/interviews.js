"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const interviewControllers_1 = require("../controllers/interviewControllers");
const router = (0, express_1.Router)();
router.post("/conductInterview", middlewares_1.authenticateJwt, interviewControllers_1.conduct_interview);
router.get('/getInterviewStatus/:interviewId', middlewares_1.authenticateJwt, interviewControllers_1.get_interview_status);
exports.default = router;
