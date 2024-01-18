// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { StudentModel } from "../../db/student.ts";
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";

export const deleteStudent = async ( req: Request<{ id: string }>,  res: Response<string | CustomError>) => {
  try{
    const id = req.params.id;
    const student = await StudentModel.findByIdAndDelete(id);
    if (!student) {
      res.status(404).send(newCustomError("Not Found.","student id has been found.", ""));
      return;
    }
    res.status(200).send("student deleted");
  }catch(error){
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};


export const deleteStudents = async (  _req: Request<{}>,  res: Response<string | CustomError>) => {
  try{
    const student = await StudentModel.deleteMany({});
    if (!student) {
      res.status(404).send(newCustomError("Not Found.","students has been found.", ""));
      return;
    }
    res.status(200).send("student deleted");
  }catch(error){
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};

