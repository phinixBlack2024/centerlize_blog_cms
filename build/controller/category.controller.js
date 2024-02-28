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
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryCreate = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const categoryCreate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, status } = req.body;
    if (!description) {
        return res.status(400).json({ status: true, code: 400, msg: "Description are required" });
    }
    if (!name) {
        return res.status(400).json({ status: true, code: 400, msg: "name are required" });
    }
    if (!status) {
        return res.status(400).json({ status: true, code: 400, msg: "status are required" });
    }
    return res.status(400).json({ "message": "helo" });
}));
exports.categoryCreate = categoryCreate;
