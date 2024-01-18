import {  SubjectModelType,SubjectModel } from "../db/subject.ts";
import mongoose from "mongoose";
import { StudentModelType } from "../db/student.ts";
import { Student } from "../types.ts";
import { getSubjectFromModel } from "./getSubjectFromModel.ts";

export const getStudentFromModel = async (student: StudentModelType): Promise<Student > => {
  const { _id, name, email} = student;
  if(!student) throw Error

  const subjects: SubjectModelType[] = await SubjectModel.find({studentsID: {$eq: student.id}})

  const upd_subs = await Promise.all(subjects.map(async function(subject: SubjectModelType){
    const students = subject.studentsID.reduce((acc: mongoose.Types.ObjectId[],elem: mongoose.Types.ObjectId)=>{
        if(elem.toString()===_id.toString()){
            return acc
        }else{
            return [...acc,elem]
        }
    },[])
    const subs: SubjectModelType = new SubjectModel({
        _id: subject._id,
        name: subject.name,
        year: subject.year,
        teacherID: subject.teacherID,
        studentsID: students
    })

    return await getSubjectFromModel(subs)
  }))
  return {
    id: _id.toString(),
    name,
    email,
    //@ts-expect-error>
    subjects: upd_subs
    };
}

