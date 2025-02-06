import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortContainer from "@/components/SortContainer";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
    Attendance,
    Class,
    Prisma,
    Student,
    Subject,
    Teacher,
} from "@prisma/client";
import { Zen_Dots } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

type AttendanceList = Attendance & { student: Student } & {
    lesson: {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
};

const AttendanceListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    const columns = [
        {
            header: "Student name",
            accessor: "studentName",
        },
        {
            header: "Subject",
            accessor: "subject",
        },
        {
            header: "Class",
            accessor: "class",
            className: "hidden md:table-cell",
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell",
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
        },
        {
            header: "Present",
            accessor: "present",
            className: "hidden md:table-cell",
        },

    
            
                {
                    header: "Actions",
                    accessor: "action",
                },
    ];

    const renderRow = (item: AttendanceList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                {item.student.name + " " + item.student.surname}
            </td>
            <td>{item.lesson.subject?.name || "-"}</td>
            <td>{item.lesson.class?.name || "-"}</td>
            <td className="hidden md:table-cell">
                {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
            </td>
            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat("en-Us").format(item.date)}
            </td>
            <td className="hidden md:table-cell">
                {item.present ? "Present" : "Absent"}
            </td>

            <td className="">
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormContainer table="attendance" type="update" data={item} />
                            <FormContainer table="attendance" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const resolvedParams = await Promise.resolve(searchParams);

    const { page, sortOrder ="asc",...queryParams } = resolvedParams;

    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.AttendanceWhereInput = {};

    query.lesson = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = parseInt(value);
                        break;
                    case "teacherId":
                        query.lesson.teacherId = value;
                        break;
                    case "studentId":
                        query.studentId = value;
                        break;
                    case "search":
                        query.student = {
                            OR: [
                                { name: { contains: value, mode: "insensitive" } },
                                { surname: { contains: value, mode: "insensitive" } },
                            ],
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const defaultSortOrder = sortOrder === "asc" ? "asc" : "desc";

    // ROLE CONDITIONS

    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = currentUserId!;
            break;
        case "student":
            query.studentId = currentUserId!;
            break;
        case "parent":
            query.student = {
                parentId: currentUserId!,
            };
            break;
        default:
            break;
    }

    const [data, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: query,
            include: {
                student: { select: {name:true, surname:true, parentId:true,}},
                lesson: {
                    select:{
                        subject: { select: {name:true}},
                        teacher: {select: {name:true, surname:true}},
                        class: {select: {name: true}}
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.attendance.count({ where: query }),
    ]);

    return (
        <div className="bg-white p4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Attendance
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button> */}
                        <SortContainer initialSortOrder={defaultSortOrder}/>
                    
                            <FormContainer table="attendance" type="create" />
                       
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div className="">
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>
            {/* PAGINATION */}
            <div className="">
                <Pagination page={p} count={count} />
            </div>
        </div>
    );
};

export default AttendanceListPage;
