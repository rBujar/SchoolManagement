"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
   
    lessonSchema,
    LessonSchema,
    
} from "@/lib/formValidationSchemas";
import {
    createLesson,
    updateLesson,
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

const LessonForm = ({
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
    } = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
    });

    const [state, formAction, pending] = useActionState(
        type === "create" ? createLesson : updateLesson,
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
            toast(`Ora mësimore është ${type === "create" ? "krijuar" : "përditësuar"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { teachers, subjects, classes } = relatedData;
    // const { teachers = [] } = relatedData || {};

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Krijo një orë mësimore" : "Përditëso orën mësimore"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Emri i orës mësimore"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Data e fillimit"
                    name="startTime"
                    defaultValue={data?.startTime}
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                />
                <InputField
                    label="Data e mbarimit"
                    name="endTime"
                    defaultValue={data?.endTime}
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
                />

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Dita</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("day")}
                        defaultValue={data?.day}
                    >
                        <option value="MONDAY">E Hënë</option>
                        <option value="TUESDAY">E Martë</option>
                        <option value="WEDNESDAY">E Mërkurë</option>
                        <option value="THURSDAY">E Enjte</option>
                        <option value="FRIDAY">E Premte</option>
                    </select>
                    {errors.day?.message && (
                        <p className="text-xs text-red-400">
                            {errors.day.message.toString()}
                        </p>
                    )}
                </div>

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
                    <label className="text-xs text-gray-500">Mësimdhënësit</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherId")}
                        defaultValue={data?.teacherId}
                    >
                        {teachers.map(
                            (teacher: { id: number; name: string; surname: string }) => (
                                <option value={teacher.id} key={teacher.id}>
                                    {teacher.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.teacherId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teacherId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Lëndët</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjectId}
                    >
                        {subjects.map((subject: { id: number; name: string }) => (
                            <option value={subject.id} key={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.subjectId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Klasat</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        {classes.map((classItem: { id: number; name: string }) => (
                            <option value={classItem.id} key={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message.toString()}
                        </p>
                    )}
                </div>
            </div>

            {state.error && (
                <span className="text-red-500">Ka ndodhur një gabim!</span>
            )}

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Krijo" : "Përditëso"}
            </button>
        </form>
    );
};

export default LessonForm;
