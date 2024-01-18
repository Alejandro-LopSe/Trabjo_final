// @deno-types="npm:@types/express@4"
import express from "express";
import mongoose from "mongoose";
import { postSubject } from "./resolvers/posts/postSubject.ts";
import { deleteSubject, deleteSubjects} from "./resolvers/deletes/deleteSubject.ts";
import { getSubject,getSubjects } from "./resolvers/gets/getSubject.ts";
import { postteacher } from "./resolvers/posts/postTeacher.ts";
import { postStudent } from "./resolvers/posts/postStudent.ts";
import { funcionbase } from "./controllers/funcionbase.ts";
import { getTeacher, getTeachers } from "./resolvers/gets/getTeachers.ts";
import { getStudent, getStudents } from "./resolvers/gets/getStudent.ts";
import { deleteTeacher, deleteTeachers } from "./resolvers/deletes/deleteTeacher.ts";
import { deleteStudent, deleteStudents } from "./resolvers/deletes/deleteStudent.ts";
import { putSubject} from "./resolvers/updates/putSubject.ts"
import { putTeacher } from "./resolvers/updates/putTeacher.ts";
import { putStudent } from "./resolvers/updates/putStudent.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = Deno.env.get("MONGO_URL") || env["MONGO_URL"];


await mongoose.connect(MONGO_URL!);
const app = express();
app.use(express.json());
app
.get("/", funcionbase)
.get("/subjects", getSubjects)
.get("/subject/:id", getSubject)
.get("/teachers", getTeachers)
.get("/teacher/:id", getTeacher)
.get("/students", getStudents)
.get("/student/:id",getStudent )
/*

*/
.post("/subject", postSubject)
.post("/student", postStudent)
.post("/teacher", postteacher)
/*

*/
.put("/subject/:id", putSubject )
.put("/teacher/:id", putTeacher )
.put("/student/:id", putStudent)
/*

*/
.delete("/subject/:id", deleteSubject)
.delete("/subjects", deleteSubjects )
.delete("/teacher/:id", deleteTeacher)
.delete("/teachers", deleteTeachers)
.delete("/student/:id", deleteStudent )
.delete("/students", deleteStudents)
/*

*/

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
