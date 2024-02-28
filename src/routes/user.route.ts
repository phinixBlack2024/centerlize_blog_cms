import { Router } from "express";
const router = Router();
import {login} from "../controller/auth.controller"
import {categoryCreate} from "../controller/category.controller"
import { verifyJwt } from "../middlerware/auth.middleware";
router.route('/login').post(login);
router.route('/categoryCreate').post(verifyJwt,categoryCreate)
export default router;