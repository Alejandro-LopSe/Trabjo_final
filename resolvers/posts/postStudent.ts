// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Teacher, CustomError } from "../../types.ts";
import { TeacherModel, TeacherModelType } from "../../db/teacher.ts";
import { getTeacherFromModel } from "../../controllers/getTeacherFromModel.ts";
import { StudentModel, StudentModelType } from "../../db/student.ts";
import { Student } from "../../types.ts";
import { getStudentModel } from "../../controllers/getStudentModel.ts";

export const postStudent = async (
  req: Request<{}, {}, StudentModelType>,
  res: Response<Student | CustomError >
) => {
  try {
    const { name, email } = req.body;
    const subjects= []
    const student = new StudentModel({
      name,
      email
    });
    const saved_subject = await student.save();

    const studentres: Student = await getStudentModel(saved_subject);

    res.status(200).send(studentres)
  } catch (error) {

    console.log(error);
    const e:CustomError = error
    res.status(500).send(e);
  }
};
