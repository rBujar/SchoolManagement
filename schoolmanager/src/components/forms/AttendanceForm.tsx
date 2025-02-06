"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
    announcementSchema,
    AnnouncementSchema,
    attendanceSchema,
    AttendanceSchema,
} from "@/lib/formValidationSchemas";
import {
    createAnnouncement,
    createAttendance,
    updateAnnouncement,
    updateAttendance,
} from "@/lib/actions";
import {
    Dispatch,
    SetStateAction,
    startTransition,
    useActionState,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AttendanceForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
    });

    const [state, formAction, pending] = useActionState(
        type === "create" ? createAttendance : updateAttendance,
        { success: false, error: false }
    );
    

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(
                `Attendance has been ${type === "create" ? "created" : "updated"}!`
            );
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { lessons, students } = relatedData;
    // const { teachers = [] } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create"
                    ? "Create a new Attendance"
                    : "Update the Attendance"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">

               

                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Lessons</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("lessonId")}
                        defaultValue={data?.lessonId}
                    >
                        {lessons.map((lesson: { id: string; name: string }) => (
                            <option
                                value={lesson.id}
                                key={lesson.id}
                                defaultValue={lesson.name}
                            >
                                {lesson.name}
                            </option>
                        ))}
                    </select>
                    {errors.studentId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.studentId.message.toString()}
                        </p>
                    )}
                </div>

                <InputField
                    label="Date"
                    name="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                    type="datetime-local"
                    />

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Students</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("studentId")}
                        defaultValue={data?.studentId}
                    >
                        {students.map(
                            (student: { id: string; name: string; surname: string }) => (
                                <option
                                    value={student.id}
                                    key={student.id}
                                    defaultValue={student.name + " " + student.surname}
                                >
                                    {student.name + " " + student.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.studentId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.studentId.message.toString()}
                        </p>
                    )}
                </div>

                <div className="flex  gap-2 w-full md:w-1/2">
                    <label className="text-md ">Is the student present?</label>
                    <input
                        type="checkbox"
                        {...register("present")}
                        defaultChecked={data?.present}
                        className="w-5 h-5 rounded-md border-gray-300 text-blue-500 focus:ring focus:ring-blue-200 mt-0.5"
                    />
                    {errors.present?.message && (
                        <p className="text-xs text-red-400">
                            {errors.present?.message.toString()}
                        </p>
                    )}
                </div>
            </div>

            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default AttendanceForm;
