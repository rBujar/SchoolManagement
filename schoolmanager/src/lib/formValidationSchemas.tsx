import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Subject name is required!" }),
    teachers: z.array(z.string()) //teacher Id
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Subject name is required!" }),
    capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
    gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
    supervisorId: z.coerce.string().optional()
});
 
export type ClassSchema = z.infer<typeof classSchema>;


export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must not be longer than 20 characters!" }),
        password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal("")),
        name: z.string().min(1, { message: "First name is required" }),
        surname: z.string().min(1, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: "Blood type is required" }),
    birthday: z.coerce.date({ message: "Birthday is required" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    subjects: z.array(z.string()).optional(), //subjectId
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must not be longer than 20 characters!" }),
        password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal("")),
        name: z.string().min(1, { message: "First name is required" }),
        surname: z.string().min(1, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z.string().min(1, { message: "Blood type is required" }),
    birthday: z.coerce.date({ message: "Birthday is required" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    gradeId: z.coerce.number().min(1, {message:"Grade is required!"}),
    classId: z.coerce.number().min(1, {message:"Class is required!"}),
    parentId: z.string().min(1, {message:"Parent Id is required!"}),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title name is required!" }),
    startTime:z.coerce.date({message:"Start time is required!"}),
    endTime:z.coerce.date({message:"End time is required!"}),
    lessonId:z.coerce.number({message:"Lesson time is required!"}),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Subject name is required!" }),
    startDate:z.coerce.date({message:"Start Date is required!"}),
    dueDate:z.coerce.date({message:"Due Date is required!"}),
    lessonId:z.coerce.number({message:"Lesson is required!"}),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>; 

export const parentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must not be longer than 20 characters!" }),
        password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" }).optional().or(z.literal("")),
        name: z.string().min(1, { message: "First name is required" }),
        surname: z.string().min(1, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
        phone: z.string().optional(),
        address: z.string(),
        students: z.array(z.string()).optional(),});

export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Title name is required!" }),
    startTime:z.coerce.date({message:"Start time is required!"}),
    endTime:z.coerce.date({message:"End time is required!"}),
    subjectId:z.coerce.number({message:"Subject id is required!"}),
    classId:z.coerce.number({message:"Class Id is required!"}),
    teacherId:z.string().min(1, {message:"Teacher Id is required!"}),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], { message: "Day is required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;


export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title name is required!" }),
    description: z.string().min(1, { message: "Description name is required!" }),
    date:z.coerce.date({message:"Date is required!"}),
    classId:z.coerce.number({message:"Lesson time is required!"}),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title name is required!" }),
    description: z.string().min(1, { message: "Description name is required!" }),
    startTime:z.coerce.date({message:"Start time is required!"}),
    endTime:z.coerce.date({message:"End time is required!"}),
    classId:z.coerce.number({message:"Lesson time is required!"}),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const attendanceSchema = z.object({
    id: z.coerce.number().optional(),
    date:z.coerce.date({message:"Date is required!"}),
    present: z.boolean().default(false),
    studentId:z.string({message:"Student Id is required!"}),
    lessonId:z.coerce.number({message:"Lesson Id is required!"}),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score:z.coerce.number({message:"Date is required!"}),
    examId:z.coerce.number({message:"Exam Id is required!"}).optional(),
    assignmentId:z.coerce.number({message:"Assignment Id is required!"}).optional(),
    studentId:z.string({message:"Student Id is required!"}),
});

export type ResultSchema = z.infer<typeof resultSchema>;





