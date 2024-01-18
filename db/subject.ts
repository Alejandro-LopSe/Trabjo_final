import mongoose from "mongoose";
import { Subject} from "../types.ts";
import { TeacherModel } from "./teacher.ts";
import { StudentModel } from "./student.ts";

const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    name: { type: String, required: true},
    year: { type: Number, required: true },
    teacherID: { type: Schema.Types.ObjectId,required: true, ref: "Teacher" },
    studentsID: [
      { type: Schema.Types.ObjectId,required: true, ref: "Student" },
    ]
  }
);

// validate studentsID
subjectSchema.path("studentsID").validate(async function (studentsID: mongoose.Types.ObjectId[]) {
    try {
      if (studentsID.some((id) => !mongoose.isValidObjectId(id))) return false;

      const students = await StudentModel.find({ _id: { $in: studentsID } });
      return students.length === studentsID.length;
    } catch (e) {
      console.log(e);
      
      return false;
    }
  });

// validate teacherID
subjectSchema.path("teacherID").validate(async function (teacherID: mongoose.Types.ObjectId) {
    try {
      if (!mongoose.isValidObjectId(teacherID)) return false;
      const teacher = await TeacherModel.findById(teacherID);
      if (!teacher) return false;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  });

  subjectSchema.pre("save", async function(next){

    const exist = await SubjectModel.findOne({name: this.name})
    if(exist){
      throw  {
        ErrorClass: "Duplicate.",
        Message: `This Subject: ${this.name} alrready exists.`,
        Solution: "Choose other name."
      }
    }
  
    next()
  })
  subjectSchema.pre("findOneAndUpdate", async function(next){
    const id = this.getQuery()

    const up  = this.getUpdate()
        //@ts-ignore>
    const update = up["$set"]

    const exist = await SubjectModel.findOne({_id: id})

    
    //@ts-ignore>
    if(!update.name){
      //@ts-ignore>
      update.name = exist!.name
    }
    //@ts-ignore>
    if(!update.year){
      //@ts-ignore>
      update.year = exist!.year
    }
    //@ts-ignore>
    if(!update.teacherID){
      //@ts-ignore>
      update.teacherID = exist!.teacherID
    }
    //@ts-ignore>
    if(!update.studentsID){
      //@ts-ignore>
      update.studentsID = exist!.studentsID
    }
    this.setUpdate(update)
  
    next()
  })

export type SubjectModelType = mongoose.Document &
  Omit<Subject, "id" | "teacher" | "students"> & {
    teacherID: mongoose.Types.ObjectId;
    studentsID: Array<mongoose.Types.ObjectId>;
  };

export const SubjectModel = mongoose.model<SubjectModelType>(
  "subjects",
  subjectSchema
);
