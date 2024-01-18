// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Teacher, CustomError } from "../../types.ts";
import { TeacherModel, TeacherModelType } from "../../db/teacher.ts";
import { getTeacherFromModel } from "../../controllers/getTeacherFromModel.ts";

export const postteacher = async (
  req: Request<{}, {}, TeacherModelType>,
  res: Response<Teacher | CustomError >
) => {
  try {
    const { name, email } = req.body;
    const subjects= []
    const teacher = new TeacherModel({
      name,
      email
    });
    const saved_subject = await teacher.save();

    const teacherresponse: Teacher = await getTeacherFromModel(saved_subject);

    res.status(200).send(teacherresponse)
  } catch (error) {

    console.log(error);
    const e:CustomError = error
    res.status(500).send(e);
  }
};
