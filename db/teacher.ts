import mongoose from "mongoose";
import { Teacher } from "../types.ts";
import { SubjectModel } from "./subject.ts";

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  }
);

teacherSchema.path("email").validate(async function(email:string){
  const exist = await TeacherModel.findOne({email: email})
  if(exist)return false
})

teacherSchema.post("findOneAndDelete",async function(doc,next){
    
  await SubjectModel.deleteMany({teacherID: doc._id})
  next()
})

export type TeacherModelType = mongoose.Document &
  Omit<Teacher, "id" | "subjects">;

export const TeacherModel = mongoose.model<TeacherModelType>(
  "teachers",
  teacherSchema
);
