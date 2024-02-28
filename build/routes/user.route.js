"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controller/auth.controller");
const category_controller_1 = require("../controller/category.controller");
const auth_middleware_1 = require("../middlerware/auth.middleware");
router.route('/login').post(auth_controller_1.login);
router.route('/categoryCreate').post(auth_middleware_1.verifyJwt, category_controller_1.categoryCreate);
exports.default = router;
