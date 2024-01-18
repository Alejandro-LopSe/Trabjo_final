// deno-lint-ignore-file
// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { Subject } from "../../types.ts";
import { SubjectModel, SubjectModelType } from "../../db/subject.ts";
import { getSubjectFromModel } from "../../controllers/getSubjectFromModel.ts";
import { CustomError } from "../../types.ts";
import newCustomError from "../../controllers/customerror.ts";

export const putSubject = async (req: Request<{ id: string },{}, SubjectModelType>, res: Response<Subject | CustomError>) => {
  
  try {
    const id = req.params.id;
    const { name, year, teacherID, studentsID } = req.body;
    const subject = await SubjectModel.findOneAndUpdate({_id: id},{$set: {name: name, year:year, teacherID:teacherID, studentsID: studentsID} }).exec();

      
    if (!subject) {
      res.status(404).send(newCustomError("Not Found.","Subject id hasnt been found.", ""));
      return;
    }
    const newup= await SubjectModel.findById(id)
    //@ts-expect-error>
    const subjectResponse: Subject = await getSubjectFromModel(newup);
    res.status(200).send(subjectResponse);
  } catch (error) {
    const customerror: CustomError = error
    console.log(customerror);
    res.status(500).send(customerror);
  }
};
