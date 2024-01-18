// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
export const funcionbase = (_req: Request, res: Response) => {res.status(200).send("operativo.")}