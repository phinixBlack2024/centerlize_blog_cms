import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const categoryCreate = asyncHandler(async (req: Request, res: Response) => {
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
   return res.status(400).json({"message":"helo"})
})

export {categoryCreate}
