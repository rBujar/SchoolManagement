import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import SortContainer from "@/components/SortContainer";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Prisma, Teacher } from "@prisma/client";
import { Zen_Dots } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

type ClassList = Class & { supervisor: Teacher };

const ClassListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    const columns = [
        {
            header: "Class Name",
            accessor: "name",
        },
        {
            header: "Capacity",
            accessor: "capacity",
            className: "hidden md:table-cell",
        },
        {
            header: "Grade",
            accessor: "grade",
            className: "hidden md:table-cell",
        },
        {
            header: "Supervisor",
            accessor: "supervisor",
            className: "hidden md:table-cell",
        },
        ...(role === "admin"
            ? [
                {
                    header: "Actions",
                    accessor: "actions",
                },
            ]
            : []),
    ];

    const renderRow = (item: ClassList) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">{item.name}</td>
            <td className="hidden md:table-cell">{item.capacity}</td>
            <td className="hidden md:table-cell">{item.name[0]}</td>
            <td className="hidden md:table-cell">
                {item.supervisor.name + " " + item.supervisor.surname}
            </td>
            <td className="">
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormContainer table="class" type="update" data={item} />
                            <FormContainer table="class" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    );

    const resolvedParams = await Promise.resolve(searchParams);

    const { page, sortOrder = "asc", ...queryParams } = resolvedParams;

    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION

    const query: Prisma.ClassWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "supervisor":
                        query.supervisorId = value;
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //ROLE PARAMS
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.supervisorId = currentUserId!;
            break;
        case "student":
            query.students = {
                some: { id: currentUserId! },
            };
            break;
        case "parent":
            query.students = {
                some: { parentId: currentUserId! },
            };
            break;
        default:
            break;
    }

    const defaultSortOrder = sortOrder === "asc" ? "asc" : "desc";

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
            },
            orderBy: { createdAt: defaultSortOrder},
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.class.count({ where: query }),
    ]);

    return (
        <div className="bg-white p4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All classes</h1>
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
                        {role === "admin" && <FormContainer table="class" type="create" />}
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

export default ClassListPage;
