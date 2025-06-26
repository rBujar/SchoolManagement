"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAssignment, createSubject, updateAssignment, updateSubject } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignmentForm = ({
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
    } = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema),
    });

    const [state, formAction, pending] = useActionState(
        type === "create" ? createAssignment : updateAssignment,
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
            toast(`Detyra është ${type === "create" ? "krijuar" : "përditësuar"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { lessons } = relatedData;
    // const { teachers = [] } = relatedData || {};


    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Krijo një detyrë" : "Përditëso detyrën"}
            </h1>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Titulli i detyrës"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Afati i fillimit"
                    name="startDate"
                    defaultValue={data?.startDate}
                    register={register}
                    error={errors?.startDate}
                    type="datetime-local"
                />
                <InputField
                    label="Afati i dorëzimit"
                    name="dueDate"
                    defaultValue={data?.dueDate}
                    register={register}
                    error={errors?.dueDate}
                    type="datetime-local"

                />
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
                    <label className="text-xs text-gray-500">Ora mësimore</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("lessonId")}
                        defaultValue={data?.teachers}
                    >
                        {lessons.map(
                            (lesson: { id: number; name: string; }) => (
                                <option value={lesson.id} key={lesson.id}>{lesson.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.lessonId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.lessonId.message.toString()}
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

export default AssignmentForm;
