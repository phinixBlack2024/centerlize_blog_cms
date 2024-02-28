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
exports.login = void 0;
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constant_1 = __importDefault(require("../constant"));
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = constant_1.default;
const prisma = new client_1.PrismaClient();
const refreshTokenValue = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenGenerated = jsonwebtoken_1.default.sign({
        id: id,
    }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
    return refreshTokenGenerated;
});
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailDataType = yield prisma.user.findFirst({
            where: {
                id: userId
            },
        });
        if (!emailDataType) {
            throw new Error("User not found");
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: emailDataType.id,
            email: emailDataType.email,
            name: emailDataType.name,
        }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = yield refreshTokenValue(emailDataType.id); // Temporary refresh token
        const storeRefreshToken = yield prisma.user.update({
            where: {
                id: emailDataType.id
            },
            data: {
                refresh_token: refreshToken
            }
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new apiError_1.ApiError(500, "Something went wrong while generating refresh and access token");
    }
});
const login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ status: true, code: 400, msg: "Email required" });
    }
    if (!password) {
        return res.status(400).json({ status: true, code: 400, msg: "Password required" });
    }
    try {
        const emailData = yield prisma.user.findFirst({
            where: {
                email: email
            },
        });
        if (!emailData) {
            return res.status(400).json({ status: true, code: 400, msg: "User does not exist" });
        }
        const databasePassword = emailData.password;
        const checkPassword = yield bcrypt_1.default.compare(password, databasePassword);
        if (!checkPassword) {
            return res.status(401).json({ status: true, code: 401, msg: "Incorrect password" });
        }
        const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(emailData.id);
        const options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200).cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            status: false, code: 500, msg: "User Loging Successfully", data: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
    }
    catch (error) {
        return res.status(500).json({ status: false, code: 500, msg: "Server error" });
    }
}));
exports.login = login;
