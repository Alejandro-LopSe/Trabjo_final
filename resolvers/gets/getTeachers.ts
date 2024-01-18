// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import {  CustomError } from "../../types.ts";
import {newCustomError} from "../../controllers/customerror.ts";
import { Teacher } from "../../types.ts";
import { TeacherModel } from "../../db/teacher.ts";
import { getTeacherFromModel } from "../../controllers/getTeacherFromModel.ts";
import { TeacherModelType } from "../../db/teacher.ts";

export const getTeacher = async (req: Request<{ id: string }>,res: Response<Teacher | CustomError>) => {
  try {
    const id = req.params.id;
    const teacher = await TeacherModel.findById(id).exec();
    if (!teacher) {
      res.status(404).send(newCustomError("Not Found.","teacher id hasnt been found.", ""));
      return;
    }
    const teacherResponse: Teacher = await getTeacherFromModel(teacher);
    res.status(200).send(teacherResponse);
  } catch (error) {
    const customerror: CustomError = error
    res.status(500).send(customerror);
  }
};

export const getTeachers = async (
  _req: Request,
  res: Response<Teacher[] | CustomError>
) => {
  try {
    const teacher: TeacherModelType[]= await TeacherModel.find();
    const teacherResponse: Teacher[] = await Promise.all(teacher.map((s) => {
      return getTeacherFromModel(s)
    }));
    res.status(200).send(teacherResponse);
  } catch (error) {
    const customerror: CustomError = error
    res.status(500).send(customerror);
  }
};
