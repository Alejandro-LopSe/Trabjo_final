// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject, CustomError } from "../../types.ts";

import { SubjectModel, SubjectModelType } from "../../db/subject.ts";
import { getSubjectFromModel } from "../../controllers/getSubjectFromModel.ts";

export const postSubject = async (
  req: Request<{}, {}, SubjectModelType>,
  res: Response<Subject | CustomError | {Saved: SubjectModelType,getted: Subject}>
) => {
  try {
    const { name, teacherID, studentsID, year } = req.body;
    const subject = new SubjectModel({
      name,
      year,
      teacherID,
      studentsID,
    });
    const saved_subject = await subject.save();
    //@ts-expect-error>
    const subjectResponse: Subject = await getSubjectFromModel(subject);

    res.status(200).send(subjectResponse)
  } catch (error) {

    console.log(error);
    const e:CustomError = error
    res.status(500).send(e);
  }
};
