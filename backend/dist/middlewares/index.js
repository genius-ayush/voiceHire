"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.SECRET = void 0;
exports.SECRET = 'SECr3t';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!payload) {
                return res.sendStatus(403);
            }
            if (typeof payload == 'string') {
                return res.sendStatus(403);
            }
            // console.log(payload.id); 
            req.headers['recruiterId'] = payload.id;
            next();
        });
    }
    else {
        res.sendStatus(401).json({ message: "unauthorized" });
    }
};
exports.authenticateJwt = authenticateJwt;
