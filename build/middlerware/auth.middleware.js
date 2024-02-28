"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = __importDefault(require("../constant"));
const client_1 = require("@prisma/client");
const { ACCESS_TOKEN_SECRET } = constant_1.default;
const prisma = new client_1.PrismaClient();
const verifyJwt = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!token) {
            return res.status(400).json({ status: false, code: 500, msg: "Please login first" });
        }
        const decodeToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const userDetails = decodeToken;
        const user = yield prisma.user.findFirst({
            where: {
                id: userDetails.id
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
        if (!user) {
            return res.status(404).json({ status: false, code: 404, msg: "User not found" });
        }
        req.customData = user;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, code: 500, msg: "Server error" });
    }
}));
exports.verifyJwt = verifyJwt;
