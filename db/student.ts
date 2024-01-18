import mongoose from "mongoose";
import { Student } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  }
);
studentSchema.path("email").validate(async function(email:string){
  const exist = await StudentModel.findOne({email: email})
  if(exist)return false
})
studentSchema.post("findOneAndDelete",async function(doc,next){
    
  await SubjectModel.updateMany({studentsID: {$eq: doc._id}},{$pull: {studentsID: {$eq: doc._id}}})
  next()
})
export type StudentModelType = mongoose.Document &
  Omit<Student, "id" | "subjects">;

export const StudentModel = mongoose.model<StudentModelType>(
  "students",
  studentSchema
);
