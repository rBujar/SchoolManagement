"use server";

import { revalidatePath } from "next/cache";
import {
    AnnouncementSchema,
    AssignmentSchema,
    AttendanceSchema,
    ClassSchema,
    EventSchema,
    ExamSchema,
    LessonSchema,
    ParentSchema,
    ResultSchema,
    StudentSchema,
    SubjectSchema,
    TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({ id: teacherId })),
                },
            },
        });

        // revalidatePath("/list/subjects");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectSchema
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({ id: teacherId })),
                },
            },
        });

        // revalidatePath("/list/subjects");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/subjects");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
// CLASS
export const createClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.create({
            data,
        });

        // revalidatePath("/list/class");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchema
) => {
    try {
        await prisma.class.update({
            where: {
                id: data.id,
            },
            data,
        });

        // revalidatePath("/list/class");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/class");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
// TEACHER
export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
) => {
    try {
        const clerk = await clerkClient();

        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" },
        });

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }

    try {
        const client = await clerkClient();

        await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.teacher.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });
        // revalidatePath("/list/teachers");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();

        await client.users.deleteUser(id);

        await prisma.teacher.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/teachers");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// STUDENT
export const createStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } },
        });

        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: true };
        }

        const clerk = await clerkClient();

        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" },
        });

        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            },
        });

        // revalidatePath("/list/students");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateStudent = async (
    currentState: CurrentState,
    data: StudentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }

    try {
        const client = await clerkClient();

        await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId,
            },
        });
        // revalidatePath("/list/students");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();

        await client.users.deleteUser(id);

        await prisma.student.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/students");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

//EXAM

export const createExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateExam = async (
    currentState: CurrentState,
    data: ExamSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

//Assignment

export const createAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.assignment.create({
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/assignments");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateAssignment = async (
    currentState: CurrentState,
    data: AssignmentSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.assignment.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/assignments");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteAssignment = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.assignment.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
            },
        });

        // revalidatePath("/list/assignment");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

// Parent
export const createParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    try {
        const clerk = await clerkClient();

        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "parent" },
        });

        await prisma.parent.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                students: data.students?.length
                    ? {
                        connect: data.students.map((studentId: string) => ({
                            id: studentId,
                        })),
                    }
                    : undefined, // If no students are provided, this will not be included
            },
        });

        // revalidatePath("/list/parent");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateParent = async (
    currentState: CurrentState,
    data: ParentSchema
) => {
    if (!data.id) {
        return { success: false, error: true };
    }

    try {
        const client = await clerkClient();

        await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        await prisma.parent.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                students: data.students?.length
                    ? {
                        set: data.students.map((studentId: string) => ({
                            id: studentId,
                        })),
                    }
                    : undefined, // If no students are provided, this will not be included
            },
        });
        // revalidatePath("/list/parents");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const deleteParent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    console.log("Deleting parent with ID:", id);

    try {
        // Check if the user exists in Clerk
        const client = await clerkClient();
        const user = await client.users.getUser(id); // Verify the user exists
        console.log("User found in Clerk:", user);

        // Proceed to delete the user in Clerk
        await client.users.deleteUser(id);

        // Check if the parent exists in Prisma
        const parent = await prisma.parent.findUnique({
            where: { id },
        });
        console.log("Parent found in Prisma:", parent);

        // Proceed to delete the parent from Prisma
        await prisma.parent.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.log("Error deleting parent:", err);
        return { success: false, error: true };
    }
};


//EXAM

export const createLesson = async (
    currentState: CurrentState,
    data: LessonSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const subject = await prisma.subject.findFirst({
                where: {
                    id: data.subjectId,
                    teachers: {
                        some: {
                            id: userId!,
                        },
                    },
                },
            });

            if (!subject) {
                return {
                    success: false,
                    error: true,
                    message: "Unauthorized access to this subject.",
                };
            }
        }

        await prisma.lesson.create({
            data: {
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
                day:data.day
            },
        });

        // revalidatePath("/list/lessons");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateLesson = async (
    currentState: CurrentState,
    data: LessonSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const subject = await prisma.subject.findFirst({
                where: {
                    id: data.subjectId,
                    teachers: {
                        some: {
                            id: userId!,
                        },
                    },
                },
            });

            if (!subject) {
                return {
                    success: false,
                    error: true,
                    message: "Unauthorized access to this subject.",
                };
            }
        }

        await prisma.lesson.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
                day:data.day
            },
        });

        // revalidatePath("/list/lessons");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteLesson = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.lesson.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { teacherId: userId! } : {}),
            },
        });

        // revalidatePath("/list/lesson");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


//Announcement

export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {

        await prisma.announcement.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        // if (role === "teacher") {
        //     const teacherLesson = await prisma.lesson.findFirst({
        //         where: {
        //             teacherId: userId!,
        //             id: data.lessonId,
        //         },
        //     }); //checks is the lesson belongs to the user(teacher)

        //     if (!teacherLesson) {
        //         return { success: false, error: true };
        //     }
        // }

        await prisma.announcement.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.announcement.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
//Event

export const createEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {

        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateEvent = async (
    currentState: CurrentState,
    data: EventSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        // if (role === "teacher") {
        //     const teacherLesson = await prisma.lesson.findFirst({
        //         where: {
        //             teacherId: userId!,
        //             id: data.lessonId,
        //         },
        //     }); //checks is the lesson belongs to the user(teacher)

        //     if (!teacherLesson) {
        //         return { success: false, error: true };
        //     }
        // }

        await prisma.event.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.event.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};


//Attendance

export const createAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.attendance.create({
            data: {
                date: data.date,
                present: data.present,
                studentId: data.studentId,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateAttendance = async (
    currentState: CurrentState,
    data: AttendanceSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: data.lessonId,
                },
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherLesson) {
                return { success: false, error: true };
            }
        }

        await prisma.attendance.update({
            where: {
                id: data.id,
            },
            data: {
                date: data.date,
                present: data.present,
                studentId: data.studentId,
                lessonId: data.lessonId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteAttendance = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.attendance.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const createResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherExam = await prisma.exam.findFirst({
                where: {
                   lesson: {
                    teacherId: userId!
                   }
                },
                select:{
                    lesson:true,
                }
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherExam) {
                return { success: false, error: true };
            }
        }
        if (role === "teacher") {
            const teacherAssignment = await prisma.assignment.findFirst({
                where: {
                   lesson: {
                    teacherId: userId!
                   }
                },
                select:{
                    lesson:true,
                }
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherAssignment) {
                return { success: false, error: true };
            }
        }
        

        await prisma.result.create({
            data: {
                score: data.score,
                examId: data.examId || undefined,
                assignmentId: data.assignmentId || undefined,
                studentId: data.studentId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateResult = async (
    currentState: CurrentState,
    data: ResultSchema
) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if (role === "teacher") {
            const teacherExam = await prisma.exam.findFirst({
                where: {
                   lesson: {
                    teacherId: userId!
                   }
                },
                select:{
                    lesson:true,
                }
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherExam) {
                return { success: false, error: true };
            }
        }
        if (role === "teacher") {
            const teacherAssignment = await prisma.assignment.findFirst({
                where: {
                   lesson: {
                    teacherId: userId!
                   }
                },
                select:{
                    lesson:true,
                }
            }); //checks is the lesson belongs to the user(teacher)

            if (!teacherAssignment) {
                return { success: false, error: true };
            }
        }


        await prisma.result.update({
            where: {
                id: data.id,
            },
            data: {
                score: data.score,
                examId: data.examId,
                assignmentId: data.assignmentId,
                studentId: data.studentId,
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.result.delete({
            where: {
                id: parseInt(id),
            },
        });

        // revalidatePath("/list/exams");

        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};