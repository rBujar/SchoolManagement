import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Ju lutem shtypni emrin e lëndës!" }),
    teachers: z.array(z.string()), //teacher Id
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Ju lutem shtypni emrin e klasës!" }),
    capacity: z.coerce
        .number()
        .min(1, { message: "Ju lutem shtypni kapacitetin!" }),
    gradeId: z.coerce
        .number()
        .min(1, { message: "Ju lutem zgjidhni vitin shkollor" }),
    supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, {
            message: "Emri i përdoruesit duhet të ketë të paktën 3 karaktere!",
        })
        .max(20, {
            message: "Emri i përdoruesit nuk duhet të ketë më shum se 20 karaktere!",
        }),
    password: z
        .string()
        .min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere!" })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: "Ju lutem shtypni emrin!" }),
    surname: z.string().min(1, { message: "Ju lutem shtypni mbiemrin" }),
    email: z
        .string()
        .email({ message: "Adresa e email-it nuk është e vlefshme!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere!" }).optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z
        .string()
        .min(1, { message: "Grupi i gjakut është i detyrueshëm!" }),
    birthday: z.coerce.date({ message: "Data e lindjes është e detyrueshme!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Gjinia është e detyrueshme!" }),
    subjects: z.array(z.string()).optional(), //subjectId
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, {
            message: "Emri i përdoruesit duhet të ketë të paktën 3 karaktere!",
        })
        .max(20, {
            message: "Emri i përdoruesit nuk duhet të ketë më shumë se 20 karaktere!",
        }),
    password: z
        .string()
        .min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere!" })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: "Ju lutem shtypni emrin!" }),
    surname: z.string().min(1, { message: "Ju lutem shtypni mbiemrin!" }),
    email: z
        .string()
        .email({ message: "Adresa e email-it nuk është e vlefshme!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string(),
    img: z.string().optional(),
    bloodType: z
        .string()
        .min(1, { message: "Grupi i gjakut është i detyrueshëm!" }),
    birthday: z.coerce.date({ message: "Data e lindjes është e detyrueshme!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Gjinia është e detyrueshme!" }),
    gradeId: z.coerce
        .number()
        .min(1, { message: "Viti shkollor është i detyrueshëm!" }),
    classId: z.coerce.number().min(1, { message: "Klasa është e detyrueshme!" }),
    parentId: z.string().min(1, { message: "Prindi është i detyrueshëm!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(1, { message: "Titulli i provimit është i detyrueshëm!" }),
    startTime: z.coerce.date({ message: "Koha e fillimit është e detyrueshme!" }),
    endTime: z.coerce.date({
        message: "Koha e përfundimit është e detyrueshme!",
    }),
    lessonId: z.coerce.number({ message: "Lënda është e detyrueshme!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(1, { message: "Titulli i detyrës është i detyrueshëm!" }),
    startDate: z.coerce.date({ message: "Data e fillimit është e detyrueshme!" }),
    dueDate: z.coerce.date({ message: "Afati është i detyrueshëm!" }),
    lessonId: z.coerce.number({ message: "Lënda është e detyrueshme!" }),
});
export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const parentSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, {
            message: "Emri i përdoruesit duhet të ketë të paktën 3 karaktere!",
        })
        .max(20, {
            message: "Emri i përdoruesit nuk duhet të ketë më shumë se 20 karaktere!",
        }),
    password: z
        .string()
        .min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere!" })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: "Ju lutem shtypni emrin!" }),
    surname: z.string().min(1, { message: "Ju lutem shtypni emrin!" }),
    email: z
        .string()
        .email({ message: "Adresa e email-it nuk është e vlefshme!" })
        .optional()
        .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string(),
    students: z.array(z.string()).optional(),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: "Emri i orës mësimore është i detyrueshëm!" }),
    startTime: z.coerce.date({ message: "Koha e fillimit është e detyrueshme!" }),
    endTime: z.coerce.date({
        message: "Koha e përfundimit është e detyrueshme!",
    }),
    subjectId: z.coerce.number({ message: "Lënda është e detyrueshme!" }),
    classId: z.coerce.number({ message: "Klasa është e detyrueshme!" }),
    teacherId: z
        .string()
        .min(1, { message: "Mësimdhënësi është i detyrueshëm!" }),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
        message: "Dita është e detyrueshme!",
    }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Titulli është i detyrueshëm!" }),
    description: z
        .string()
        .min(1, { message: "Përshkrimi është i detyrueshëm!" }),
    date: z.coerce.date({ message: "Data është e detyrueshme!" }),
    classId: z.coerce.number({ message: "Klasa është e detyrueshme!" }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Titulli është i detyrueshëm!" }),
    description: z
        .string()
        .min(1, { message: "Përshkrimi është i detyrueshëm!" }),
    startTime: z.coerce.date({ message: "Koha e fillimit është e detyrueshme!" }),
    endTime: z.coerce.date({
        message: "Koha e përfundimit është e detyrueshme!",
    }),
    classId: z.coerce.number({ message: "Klasa është e detyrueshme!" }),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const attendanceSchema = z.object({
    id: z.coerce.number().optional(),
    date: z.coerce.date({ message: "Data është e detyrueshme!" }),
    present: z.boolean().default(false),
    studentId: z.string({ message: "Nxënësi është i detyrueshëm!" }),
    lessonId: z.coerce.number({ message: "Lënda është e detyrueshme!" }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score: z.coerce
        .number()
        .min(1, { message: "Rezultati është i detyrueshëm!" }),
    examId: z.coerce
        .number({ message: "Provimi është i detyrueshëm!" })
        .optional(),
    assignmentId: z.coerce
        .number({ message: "Detyra është e detyrueshme!" })
        .optional(),
    studentId: z.string({ message: "Nxënësi është i detyrueshëm!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;
