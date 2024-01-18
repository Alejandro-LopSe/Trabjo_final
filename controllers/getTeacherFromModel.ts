
import {  TeacherModelType } from "../db/teacher.ts";
import { Subject } from "../types.ts";
import { Teacher } from "../types.ts";
import { SubjectModel, SubjectModelType} from "../db/subject.ts";
import { getSubjectFromModel } from "./getSubjectFromModel.ts";
export const getTeacherFromModel = async (arg: TeacherModelType): Promise<Teacher> => {
  const { _id, name, email } = arg;

  const subjects: SubjectModelType[] = await SubjectModel.find({teacherID: _id}).select('-teacherID')

  //@ts-expect-error>
  const _subs: Subject[] = await Promise.all(subjects.map(function(e){
    return getSubjectFromModel(e)
  }))

  return {
    id: _id.toString(),
    name,
    email,
    subjects: _subs
  };
};
