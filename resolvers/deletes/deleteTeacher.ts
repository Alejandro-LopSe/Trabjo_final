// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { TeacherModel } from "../../db/teacher.ts";
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";

export const deleteTeacher = async (  req: Request<{ id: string }>,  res: Response<string | CustomError>) => {
  try{
    const id = req.params.id;
    const teacher = await TeacherModel.findByIdAndDelete(id);
    if (!teacher) {
      res.status(404).send(newCustomError("Not Found.","Subject id has been found.", ""));
      return;
    }
    res.status(200).send("teacher deleted");
}catch(error){
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};


export const deleteTeachers = async (  _req: Request<{}>,  res: Response<string | CustomError>) => {
  try{
    const teacher = await TeacherModel.deleteMany({});
    if (!teacher) {
      res.status(404).send(newCustomError("Not Found.","Subject id has been found.", ""));
      return;
    }
    res.status(200).send("teacher deleted");
}catch(error){
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
