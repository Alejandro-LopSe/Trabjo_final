// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import {  CustomError } from "../../types.ts";
import {newCustomError} from "../../controllers/customerror.ts";
import { Student } from "../../types.ts";
import { StudentModel } from "../../db/student.ts";
import { getStudentFromModel } from "../../controllers/getStudentFromModel.ts";
import { StudentModelType } from "../../db/student.ts";

export const getStudent = async (req: Request<{ id: string }>,res: Response<Student | CustomError>) => {
  try {
    const id = req.params.id;
    const student = await StudentModel.findById(id).exec();
    if (!student) {
      res.status(404).send(newCustomError("Not Found.","student id hasnt been found.", ""));
      return;
    }
    const studentResponse: Student = await getStudentFromModel(student);
    res.status(200).send(studentResponse);
  } catch (error) {
    const customerror: CustomError = error
    res.status(500).send(customerror);
  }
};

export const getStudents = async (_req: Request, res: Response<Student[] | CustomError>) => {
  try {
    const student: StudentModelType[]= await StudentModel.find();
    const studentResponse: Student[] = await Promise.all(student.map((s) => {
        
      return getStudentFromModel(s)
    }));
    res.status(200).send(studentResponse);
  } catch (error) {
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
