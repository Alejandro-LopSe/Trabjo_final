// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { SubjectModel } from "../../db/subject.ts";
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";

export const deleteSubject = async (  req: Request<{ id: string }>,  res: Response<string | CustomError>) => {
  try{
    const id = req.params.id;
    const subject = await SubjectModel.findByIdAndDelete(id);
    if (!subject) {
      res.status(404).send(newCustomError("Not Found.","Subject id has been found.", ""));
      return;
    }
    res.status(200).send("Subject deleted");

  }catch(error){
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};


export const deleteSubjects = async (  _req: Request<{}>,  res: Response<string | CustomError>) => {
  try{
    const subject = await SubjectModel.deleteMany({});
    if (!subject) {
      res.status(404).send(newCustomError("Not Found.","Subjects has been found.", ""));
      return;
    }
    res.status(200).send("Subjects deleted");
  }catch(error){
      const customerror: CustomError = error
      console.log(customerror);
      res.status(500).send(customerror);
    }
};
