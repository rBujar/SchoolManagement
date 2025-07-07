import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // ADMIN
    await prisma.admin.create({ data: { id: "admin1", username: "admin1" } });
    await prisma.admin.create({ data: { id: "admin2", username: "admin2" } });

    // GRADE
    for (let grade = 10; grade <= 12; grade++) {
        await prisma.grade.create({ data: { level: grade } });
    }

    // CLASS
    for (let grade = 10; grade <= 12; grade++) {
        for (let classNum = 1; classNum <= 5; classNum++) {
            await prisma.class.create({
                data: {
                    name: `${grade}-${classNum}`,
                    gradeId: grade - 9,
                    capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
                },
            });
        }
    }

    // SUBJECT
    const subjectData = [
        { name: "Matematikë" },
        { name: "Gjuhë shqipe" },
        { name: "Gjuhë angleze" },
        { name: "Histori" },
        { name: "Gjeografi" },
        { name: "Fizikë" },
        { name: "Kimi" },
        { name: "Biologji" },
        { name: "Teknologji" },
        { name: "Art Figurativ" },
    ];

    for (const subject of subjectData) {
        await prisma.subject.create({ data: subject });
    }

    // TEACHER
    const subjects = await prisma.subject.findMany({ select: { id: true } });
    const classes = await prisma.class.findMany({ select: { id: true } });

    const teacherNames = [
        "Arta Krasniqi",
        "Mentor Salihu",
        "Besa Ibrahimi",
        "Kushtrim Beqiri",
        "Rina Kastrati",
        "Valon Zeqiri",
        "Fjorela Ramadani",
        "Dardan Ahmeti",
        "Erza Demaj",
        "Ilir Berisha",
        "Fjolla Gashi",
        "Driton Hasani",
        "Vesa Shala",
        "Luan Hoxha",
        "Elira Dervishi",
        "Arben Islami",
        "Evelyn Lewis",
        "Artan Morina",
        "Blerta Zeneli",
        "Shpejtim Rexhepi",
    ];

    for (let i = 0; i < teacherNames.length; i++) {
        const [name, surname] = teacherNames[i].split(" ");
        await prisma.teacher.create({
            data: {
                id: `mesimdhenes${i + 1}`,
                username: `mesimdhenes${i + 1}`,
                name,
                surname,
                email: `mesimdhenes${i + 1}@shembull.com`,
                phone: `123-456-78${i + 1}`,
                address: `Addresa${i + 1}`,
                bloodType: "A+",
                sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                subjects: { connect: [{ id: subjects[i % subjects.length].id }] },
                classes: { connect: [{ id: classes[i % classes.length].id }] },
                birthday: new Date(
                    new Date().setFullYear(new Date().getFullYear() - 30)
                ),
            },
        });
    }

    // PARENT
    const parentNames = [
        "Lindita Krasniqi",
        "Fatmir Morina",
        "Miranda Bytyqi",
        "Agron Selimi",
        "Valbona Dauti",
        "Arben Kelmendi",
        "Luljeta Jashari",
        "Kujtim Mehmeti",
        "Teuta Ramaj",
    ];

    for (let i = 0; i < parentNames.length; i++) {
        const [name, surname] = parentNames[i].split(" ");
        await prisma.parent.create({
            data: {
                id: `prindi${i + 1}`,
                username: `prindi${i + 1}`,
                name,
                surname,
                email: `prindi${i + 1}@shembull.com`,
                phone: `456-789-12${i + 1}`,
                address: `Adresa${i + 1}`,
            },
        });
    }

    // STUDENT
    const grades = await prisma.grade.findMany({ select: { id: true } });
    const students = [
        "Erion Mehmeti",
        "Ardit Dauti",
        "Elira Krasniqi",
        "Diona Shabani",
        "Lira Morina",
        "Blerina Bytyqi",
        "Donika Jashari",
        "Alina Kelmendi",
        "Vjosa Ramaj",
        "Ajla Kurti",
    ];

    for (let i = 0; i < students.length; i++) {
        const [name, surname] = students[i].split(" ");
        await prisma.student.create({
            data: {
                id: `nxenesi${i + 1}`,
                username: `nxenesi${i + 1}`,
                name,
                surname,
                email: `nxenesi${i + 1}@shembull.com`,
                phone: `987-654-32${i + 1}`,
                address: `Adresa${i + 1}`,
                bloodType: "O-",
                sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
                parentId: `prindi${Math.ceil((i + 1) / 2)}`,
                gradeId: grades[i % grades.length].id,
                classId: classes[i % classes.length].id,
                birthday: new Date(
                    new Date().setFullYear(new Date().getFullYear() - 10)
                ),
            },
        });
    }

    // LESSON
    // for (let i = 1; i <= 30; i++) {
    //     await prisma.lesson.create({
    //         data: {
    //             name: `Lesson${i}`,
    //             day: Day[
    //                 Object.keys(Day)[
    //                 Math.floor(Math.random() * Object.keys(Day).length)
    //                 ] as keyof typeof Day
    //             ],
    //             startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    //             endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
    //             subjectId: (i % 10) + 1,
    //             classId: (i % 6) + 1,
    //             teacherId: `mesimdhenes${(i % 15) + 1}`,
    //         },
    //     });
    // }

    // LESSON
    const allSubjects = await prisma.subject.findMany();
    const totalLessons = 30;

    for (let i = 0; i < totalLessons; i++) {
        const subject = allSubjects[i % allSubjects.length];
        const lessonNumber = Math.floor(i / allSubjects.length) + 1;

        await prisma.lesson.create({
            data: {
                name: `${subject.name} - Mësimi ${lessonNumber}`,
                day: Day[
                    Object.keys(Day)[
                    Math.floor(Math.random() * Object.keys(Day).length)
                    ] as keyof typeof Day
                ],
                startTime: new Date(new Date().setHours(8 + (i % 8))),
                endTime: new Date(new Date().setHours(9 + (i % 8))),
                subjectId: subject.id,
                classId: classes[i % classes.length].id,
                teacherId: `mesimdhenes${(i % 15) + 1}`,
            },
        });
    }

    // EXAM
    for (let i = 1; i <= 10; i++) {
        await prisma.exam.create({
            data: {
                title: `Provimi ${i}`,
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
                lessonId: (i % 30) + 1,
            },
        });
    }

    // ASSIGNMENT
    for (let i = 1; i <= 10; i++) {
        await prisma.assignment.create({
            data: {
                title: `Detyra ${i}`,
                startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
                lessonId: (i % 30) + 1,
            },
        });
    }

    // RESULT
    for (let i = 1; i <= 10; i++) {
        await prisma.result.create({
            data: {
                score: 90,
                studentId: `nxenesi${i}`,
                ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
            },
        });
    }

    // ATTENDANCE
    for (let i = 1; i <= 10; i++) {
        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: i % 2 === 0,
                studentId: `nxenesi${i}`,
                lessonId: (i % 30) + 1,
            },
        });

        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: i % 2 !== 0,
                studentId: `nxenesi${i}`,
                lessonId: (i % 30) + 1,
            },
        });

        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: i % 2 === 0,
                studentId: `nxenesi${i}`,
                lessonId: (i % 30) + 1,
            },
        });

        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: i % 2 !== 0,
                studentId: `nxenesi${i}`,
                lessonId: (i % 30) + 1,
            },
        });

        await prisma.attendance.create({
            data: {
                date: new Date(),
                present: i % 2 === 0,
                studentId: `nxenesi${i}`,
                lessonId: (i % 30) + 1,
            },
        });
    }

    console.log("Seeding completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
