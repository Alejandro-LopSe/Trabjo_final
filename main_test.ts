// deno-lint-ignore-file
import mongoose from "mongoose";
import { assert, assertEquals,  assertExists,  assertNotEquals,  assertObjectMatch,  assertThrows,} from "https://deno.land/std@0.205.0/assert/mod.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { SubjectModel } from "./db/subject.ts";

import { TeacherModel } from "./db/teacher.ts";
import { StudentModel } from "./db/student.ts";
import {
  describe,
  it,
} from "https://deno.land/std@0.212.0/testing/bdd.ts";
import { AssertionError } from "https://deno.land/std@0.205.0/assert/assertion_error.ts";

/*test types */
type Subject_test = {
  name: string;
  year: string;
  teacherID?: string
  studentsID?: string[]
}
type Teacher_test = {
  name: string;
  email?: string;
}
type Student_test = {
  name: string;
  email?: string;
}

/*Test Fuctions */

/*post functions*/
const postStudent = async function(student: Student_test){
  const response = await fetch("https://trabajo-final.deno.dev/student",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  })
  const data = await response.json();
  
  return data;
}
const postTeacher = async function(teacher: Teacher_test){
  const response = await fetch("https://trabajo-final.deno.dev/teacher",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  })
  const data = await response.json();
  return data;
}
const postSubject = async function(subject: Subject_test){
  const response = await fetch("https://trabajo-final.deno.dev/subject",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  })
  
  const data = await response.json();
  return data;
}

/*get functions*/
const getSubjects = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/subjects`);
  const data = await response.json();
  return data;
}
const getSubject = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/subject/${id}`);
  const data = await response.json();
  return data;
}
const getTeachers = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/teachers`);
  const data = await response.json();
  return data;
}
const getTeacher = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/teacher/${id}`);
  const data = await response.json();
  return data;
}
const getStudents = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/students`);
  const data = await response.json();
  return data;
}
const getStudent = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/student/${id}`);
  const data = await response.json();
  return data;
}

/*put functions*/
const putSubject = async function(id: string,subject: Subject_test){
  const response = await fetch(`https://trabajo-final.deno.dev/subject/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subject),
  });
  const data = await response.json();
  return data;
};
const putTeacher = async function(id: string,teacher:Teacher_test){
  const response = await fetch(`https://trabajo-final.deno.dev/teacher/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(teacher),
  });
  const data = await response.json();
  return data;
}
const putStudent = async function(id: string,student: Student_test){
  const response = await fetch(`https://trabajo-final.deno.dev/student/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });
  const data = await response.json();
  return data;
}

/*delete functions*/
const deleteSubject = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/subject/${id}`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}
const deleteSubjects = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/subjects`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}
const deleteTeacher = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/teacher/${id}`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}
const deleteTeachers = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/teachers`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}
const deleteStudent = async function(id: string){
  const response = await fetch(`https://trabajo-final.deno.dev/student/${id}`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}
const deleteStudents = async function(){
  const response = await fetch(`https://trabajo-final.deno.dev/students`, {
    method: "DELETE",
  });
  const data = await response.text();
  return data;
}


/*Mongo conection */
const env = await load();
const MONGO_URL = Deno.env.get("MONGO_URL") || env["MONGO_URL"]
await mongoose.connect(MONGO_URL!);
//restarter colection
const Restartcollection = async function(name: string){
  const collections = await mongoose.connection.db.listCollections().toArray()
  const exist = collections.some((e)=>{
    return e.name===name
  })
  
  if(exist){
    await mongoose.connection.db.dropCollection(name)
  }
}

let teacherID: string 
let studentsID: string[]

/*--------------------------------------------/Test - Posts/--------------------------------------------*/
describe({name: "Posts tests", fn: ()=>{
  it({name: "Push Teacher",fn:  async (t) => {
    await Restartcollection("teachers")
    const teacher = await postTeacher({
      name: "Teacher 2",
      email: "Teacher1"
    })
    await t.step("teacher posted", async () => {
      assertEquals(teacher.name,"Teacher 2")
    })
    const exist = await TeacherModel.findOne({
      name: "Teacher 2",
      email: "Teacher1"
    })
    await t.step("teacher getted", async () => {
      assertEquals(exist!.name,"Teacher 2", "done")
    })
  },
    sanitizeResources: false,
    sanitizeOps: false,
  })
  it({name: "Push Teacher - exists",fn:  async (t) => {
    await Restartcollection("teachers")
      const teacher = await postTeacher({
        name: "Teacher 1",
        email: "Teacher1"
      })
      
      const repeat = await postTeacher({
        name: "Teacher 1",
        email: "Teacher1"
      })
      
      await t.step("teacher Error on get", async () => {
        assertExists({errors: {email: {}}})
      })
      const exist = await TeacherModel.findOne(teacher)
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Push student",fn:  async (t) => {
    await Restartcollection("students")
      const teacher = await postStudent({
        name: "student 2",
        email: "student"
      })
      await t.step("student posted", async () => {
      assertEquals(teacher.name,"student 2")
      })
      const exist = await StudentModel.findOne({
        name: "student 2",
        email: "student"
      })
      await t.step("student getted", async () => {
      assertEquals(exist!.name,"student 2")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Push student - exists",fn:  async (t) => {
    await Restartcollection("students")
      const teacher = await postStudent({
        name: "student 1",
        email: "student"
      })
      const repeat = await postStudent({
        name: "student 1",
        email: "student"
      })
      await t.step("student errorn on get", async () => {
      assertExists({errors: {email: {}}})
      })
      const exist = await TeacherModel.findOne(teacher)
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Push subject - Worng ID format",fn:  async (t) => {
    await Restartcollection("subjects")
    const students = await StudentModel.find({})
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: "1",
      studentsID: students.map((e)=>{
        return e.id
      })
    })
    await t.step("subject error Teacher", async () => {
      assertExists(subject.errors.teacherID)
    })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  })
  it({name: "Push subject",fn:  async (t) => {
    await Restartcollection("subjects")
    const teacher = await TeacherModel.findOne({})
    teacherID = teacher!.id
    const students = await StudentModel.find({})
    studentsID = students!.map((e)=>{
      return e.id
    })
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacherID,
      studentsID: studentsID
    })
    await t.step("subject posted", async () => {
    assertEquals(subject.name,"asignatura 1")
    })
    const exist = await SubjectModel.findOne({
      name: "asignatura 1"
    })
    await t.step("subject getted", async () => {
    assertEquals(exist!.name,"asignatura 1")
    })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Push subject - No Teacher",fn:  async (t) => {
    await Restartcollection("subjects")
    const teacher = await TeacherModel.findOne({})
    const students = await StudentModel.find({})
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      studentsID: students.map((e)=>{
        return e.id
      })
    })
    await t.step("subject error no teacher", async () => {
      assertExists({errors: {teacherID: {}}})
    })
  },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Push subject - exists",fn:  async (t) => {
    await Restartcollection("subjects")
    const teacher = await TeacherModel.findOne({})
    const students = await StudentModel.find({})
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacher!.id,
      studentsID: students.map((e)=>{
        return e.id
      })
    })
    const repeat = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacher!.id,
      studentsID: students.map((e)=>{
        return e.id
      })
    })
      
      assertExists({errors: {email: {}}})
    },
    sanitizeResources: false,
    sanitizeOps: false,
  })
},
sanitizeResources: false,
sanitizeOps: false
})

/*--------------------------------------------/Test - Gets/--------------------------------------------*/
describe({name: "Gets tests", fn: ()=>{
  it({name: "Get Teachers",fn:  async (t) => {
    const teacher = await getTeachers()
    await t.step("teacher getted", async () => {
      assertExists([]) 
    })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Teacher",fn:  async (t) => {
    const teacheid =  await TeacherModel.findOne({})
    const teacher = await getTeacher(teacheid!._id)
    await t.step("teacher getted", async () => {
      assertEquals(teacher!.name,"Teacher 1") 
    })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Teacher - Wrong ID",fn:  async (t) => {
    const teacheid =  await TeacherModel.findOne({})
    const teacher = await getTeacher("65a68f0d8223aea339afba8")
    await t.step("teacher error get", async () => {
      assertExists({errors: {}}) 
    })
      
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Students",fn:  async (t) => {
      const students = await getStudents()
      await t.step("Students getted", async () => {
        assertExists(students) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Student",fn:  async (t) => {
      const student = await StudentModel.findOne({name: "student 1"})      
      const students = await getStudent(student!.id)
      await t.step("Student getted", async () => {
        assertEquals(student!.name,students!.name)  
      })
      
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Student - Wrong ID",fn:  async (t) => {
      const students = await getStudent("65a68f0d8223aea339afba8")
      await t.step("Student not getted", async () => {
        assertExists({errors: {}}) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Get Subjects",fn:  async (t) => {
    const subjects = await getSubjects()
    await t.step("Subjects getted", async () => {
      assertExists(subjects) 
    })
     
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
  it({name: "Get Subject",fn:  async (t) => {
    const sub = await SubjectModel.findOne({})
    const subject = await getSubject(sub?.id)
    
    await t.step("Subject getted", async () => {
      assertExists(subject) 
    })
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
  it({name: "Get Subject - Wrong ID",fn:  async (t) => {
    const subject = await getSubject("65a68f0d8223aea339afba8")
    await t.step("Subject not getted", async () => {
      assertExists({errors: {}}) 
    })
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
},

sanitizeResources: false,
sanitizeOps: false
})

/*--------------------------------------------/Test - Deletes/--------------------------------------------*/
describe({name: "Deletes tests", fn: ()=>{
  it({name: "Delete Teachers",
    fn:  async (t) => {
      await Restartcollection("teachers")
      const teacherpost = await postTeacher({
        name: "Teacher 2",
        email: "Teacher1"
      })
      await t.step("teacher posted", async () => {
        assertEquals(teacherpost.name,"Teacher 2","Error")
      }) 
      const exist = await deleteTeachers()
      await t.step("teacher deleted", async () => {
        assertEquals(exist,"teacher deleted", "Error")
      })
      const teacher = await getTeachers()
      await t.step("teacher empty array on get", async () => {
        assertEquals(teacher, []) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Teacher",
    fn:  async (t) => {
      await Restartcollection("teachers")
      const teacherpost = await postTeacher({
        name: "Teacher 2",
        email: "Teacher1"
      })
      await t.step("teacher posted", async () => {
        assertEquals(teacherpost.name,"Teacher 2","Error")
      }) 
      const exist = await deleteTeacher(teacherpost.id)
      await t.step("teacher deleted", async () => {
        assertEquals(exist,"teacher deleted", "Error")
      })
      const teacher = await getTeacher(teacherpost.id)
      await t.step("teacher empty array on get", async () => {
        assertEquals(teacher, {ErrorClass: "Not Found.", Message: "teacher id hasnt been found.", Solution: "" }) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Teacher - Wrong ID",
    fn:  async (t) => {
      await Restartcollection("teachers")
      const teacherpost = await postTeacher({
        name: "Teacher 2",
        email: "Teacher1"
      })
      await t.step("teacher posted", async () => {
        assertEquals(teacherpost.name,"Teacher 2","Error")
      }) 
      const exist = await deleteTeacher("65a68f0d8223aea339afba8s")
      await t.step("teacher deleted error", async () => {
        assertNotEquals(exist,"teacher deleted", "Error")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Students",
    fn:  async (t) => {
      await Restartcollection("students")
      const studentp = await postStudent({
        name: "students 2",
        email: "students"
      })
      await t.step("students posted", async () => {
        assertEquals(studentp.name,"students 2","Error")
      }) 
      const exist = await deleteStudents()
      await t.step("students deleted", async () => {
        assertEquals(exist,"student deleted", "Error")
      })
      const student = await getStudents()
      await t.step("students empty array on get", async () => {
        assertEquals(student, []) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Student",
    fn:  async (t) => {
      await Restartcollection("students")
      const studentp = await postStudent({
        name: "student 2",
        email: "student"
      })
      await t.step("student posted", async () => {
        assertEquals(studentp.name,"student 2","Error")
      }) 
      const exist = await deleteStudent(studentp.id)
      await t.step("student deleted", async () => {
        assertEquals(exist,"student deleted", "Error")
      })
      const student = await getStudent(studentp.id)
      await t.step("student empty array on get", async () => {
        assertEquals(student, {ErrorClass: "Not Found.", Message: "student id hasnt been found.", Solution: "" }) 
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Student - Wrong ID",
    fn:  async (t) => {
      await Restartcollection("students")
      const teacherpost = await postStudent({
        name: "student 2",
        email: "student"
      })
      await t.step("student posted", async () => {
        assertEquals(teacherpost.name,"student 2","Error")
      }) 
      const exist = await deleteStudent("65a68f0d8223aea339afba8s")
      await t.step("student deleted error", async () => {
        assertNotEquals(exist,"student deleted", "Error")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Delete Subjects",
  fn:  async (t) => {
    //postteacher
    await Restartcollection("teachers")
    const teacher = await postTeacher({
      name: "Teacher 2",
      email: "Teacher1"
    })
    teacherID = teacher!.id
    //poststudent
    await Restartcollection("students")
      const student = await postStudent({
        name: "student 2",
        email: "student"
      })
      studentsID = [student.id]
    //postsubject
    await Restartcollection("subjects")
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacherID,
      studentsID: studentsID
    })
    await t.step("subject posted", async () => {
      assertEquals(subject.name,"asignatura 1","Error")
    }) 
    const exist = await deleteSubjects()
    await t.step("subjects deleted", async () => {
      assertEquals(exist,"Subjects deleted", "Error")
    })
    const subjects = await getSubjects()
    await t.step("subjects empty array on get", async () => {
      assertEquals(subjects, []) 
    })
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
  it({name: "Delete Subject",
  fn:  async (t) => {
    //postteacher
    await Restartcollection("teachers")
    const teacher = await postTeacher({
      name: "Teacher 2",
      email: "Teacher1"
    })
    teacherID = teacher!.id
    //poststudent
    await Restartcollection("students")
      const student = await postStudent({
        name: "student 2",
        email: "student"
      })
      studentsID = [student.id]
    //postsubject
    await Restartcollection("subjects")
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacherID,
      studentsID: studentsID
    })
    await t.step("subject posted", async () => {
      assertEquals(subject.name,"asignatura 1","Error")
    }) 
    const exist = await deleteSubject(subject.id)
    await t.step("subject deleted", async () => {
      assertEquals(exist,"Subject deleted", "Error")
    })
    const subjects = await getSubject(subject.id)
    await t.step("subject error on get", async () => {
      assertNotEquals(subjects, []) 
    })
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
  it({name: "Delete Subject - Wrong ID",
  fn:  async (t) => {
    //postteacher
    await Restartcollection("teachers")
    const teacher = await postTeacher({
      name: "Teacher 2",
      email: "Teacher1"
    })
    teacherID = teacher!.id
    //poststudent
    await Restartcollection("students")
      const student = await postStudent({
        name: "student 2",
        email: "student"
      })
      studentsID = [student.id]
    //postsubject
    await Restartcollection("subjects")
    const subject = await postSubject({
      name: "asignatura 1",
      year: "2024",
      teacherID: teacherID,
      studentsID: studentsID
    })
    await t.step("subject posted", async () => {
      assertEquals(subject.name,"asignatura 1","Error")
    }) 
    const exist = await deleteSubject("65a68f0d8223aea339afba8sa")
    await t.step("subject deleted", async () => {
      assertNotEquals(exist,"Subject deleted", "Error")
    })
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });
},
sanitizeResources: false,
sanitizeOps: false
})

/*--------------------------------------------/Test - Puts/--------------------------------------------*/
describe({name: "Update tests", fn: ()=>{
  it({name: "Update Teacher",
    fn:  async (t) => {
      await Restartcollection("teachers")
      const teacherpost = await postTeacher({
        name: "Teacher 2",
        email: "Teacher1"
      })
      await t.step("teacher posted", async () => {
        assertEquals(teacherpost.name,"Teacher 2","Error")
      }) 
      const teacherput = await putTeacher(teacherpost.id,{
        name: "Teacher new"
      })
      await t.step("teacher Updated", async () => {
        assertEquals(teacherput.name,"Teacher new", "Error")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Update Student",
    fn:  async (t) => {
      await Restartcollection("students")
      const teacherpost = await postStudent({
        name: "students 2",
        email: "students"
      })
      await t.step("Student posted", async () => {
        assertEquals(teacherpost.name,"students 2","Error")
      }) 
      const studentsput = await putStudent(teacherpost.id,{
        name: "students new"
      })
      await t.step("Student Updated", async () => {
        assertEquals(studentsput.name,"students new", "Error")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
  it({name: "Update Subject",
    fn:  async (t) => {
      await Restartcollection("subjects")
      const teacher = await TeacherModel.findOne({})
      teacherID = teacher!.id
      const students = await StudentModel.find({})
      studentsID = students!.map((e)=>{
        return e.id
      })
      const subject = await postSubject({
        name: "asignatura 1",
        year: "2024",
        teacherID: teacherID,
        studentsID: studentsID
      })
      await t.step("subject posted", async () => {
        assertEquals(subject.name,"asignatura 1","Error")
      }) 
      const subjectput = await putSubject(subject.id,{
        name: "asignatura new",
        year: "2023"
      })      
      await t.step("subject Updated", async () => {
        assertEquals(subjectput.name,"asignatura new", "Error")
      })
    },
    sanitizeResources: false,
    sanitizeOps: false,
  });
},
sanitizeResources: false,
sanitizeOps: false
})