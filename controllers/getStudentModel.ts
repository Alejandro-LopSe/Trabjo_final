
import { StudentModelType } from "../db/student.ts";
import { Subject } from "../types.ts";
import { Student } from "../types.ts";
import { SubjectModel } from "../db/subject.ts";
export const getStudentModel = async (student: StudentModelType): Promise<Student> => {
  const { _id, name, email } = student;

  const subject: Subject[]= await SubjectModel.find({ studentsID: { $in: _id } });

  return {
    id: _id.toString(),
    name,
    email,
    subjects: subject
  };
};
