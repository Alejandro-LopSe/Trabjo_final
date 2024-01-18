// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { Subject } from "../../types.ts";
import { SubjectModel, SubjectModelType } from "../../db/subject.ts";
import { getSubjectFromModel } from "../../controllers/getSubjectFromModel.ts";
import {getTeacherFromModel} from "../../controllers/getTeacherFromModel.ts"
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";
import { TeacherModelType } from "../../db/teacher.ts";
import { Teacher } from "../../types.ts";
import { TeacherModel } from "../../db/teacher.ts";

export const putTeacher = async (req: Request<{ id: string },{}, TeacherModelType>, res: Response<Teacher | CustomError>) => {
  
  try {
    const id = req.params.id;
    const { name, email} = req.body;
    const teacher = await TeacherModel.findOneAndUpdate({_id: id},{$set: {name: name, email:email} }).exec();

      
    if (!teacher) {
      res.status(404).send(newCustomError("Not Found.","teacher id hasnt been found.", ""));
      return;
    }
    const newup= await TeacherModel.findById(id)
    //@ts-expect-error>
    const teacherResponse: Teacher = await getTeacherFromModel(newup);
    res.status(200).send(teacherResponse);
  } catch (error) {
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
