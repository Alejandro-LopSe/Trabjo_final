// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";
import { Subject, CustomError } from "../../types.ts";

import { SubjectModel, SubjectModelType } from "../../db/subject.ts";
import { getSubjectFromModel } from "../../controllers/getSubjectFromModel.ts";
import {newCustomError} from "../../controllers/customerror.ts";

export const getSubject = async (req: Request<{ id: string }>,res: Response<Subject | CustomError>) => {
  try {
    const id = req.params.id;
    const subject = await SubjectModel.findById(id).exec();
    if (!subject) {
      res.status(404).send(newCustomError("Not Found.","Subject id hasnt been found.", ""));
      return;
    }
    //@ts-expect-error>
    const subjectResponse: Subject = await getSubjectFromModel(subject);
    res.status(200).send(subjectResponse);
  } catch (error) {
    const customerror: CustomError = error
    res.status(500).send(customerror);
  }
};

export const getSubjects = async (
  _req: Request,
  res: Response<Subject[] | CustomError>
) => {
  try {
    const subjects: SubjectModelType[]= await SubjectModel.find();
    //@ts-expect-error>
    const subjectsResponse: Subject[] = await Promise.all(subjects.map((s) => {
      return getSubjectFromModel(s)
    }));
    res.status(200).send(subjectsResponse);
  } catch (error) {
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
