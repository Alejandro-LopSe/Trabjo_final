// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import {getStudentFromModel} from "../../controllers/getStudentFromModel.ts"
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";
import { StudentModelType } from "../../db/student.ts";
import { Student } from "../../types.ts";
import { StudentModel } from "../../db/student.ts";

export const putStudent = async (req: Request<{ id: string },{}, StudentModelType>, res: Response<Student | CustomError>) => {
  
  try {
    const id = req.params.id;
    const { name, email} = req.body;
    const student = await StudentModel.findOneAndUpdate({_id: id},{$set: {name: name, email:email} }).exec();

      
    if (!student) {
      res.status(404).send(newCustomError("Not Found.","student id hasnt been found.", ""));
      return;
    }
    const newup= await StudentModel.findById(id)
    //@ts-expect-error>
    const studentResponse: Student = await getStudentFromModel(newup);
    res.status(200).send(studentResponse);
  } catch (error) {
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
