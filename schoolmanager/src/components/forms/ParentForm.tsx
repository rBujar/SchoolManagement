"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import {
    Dispatch,
    SetStateAction,
    startTransition,
    useActionState,
    useEffect,
    useState,
} from "react";
import {
    parentSchema,
    ParentSchema,
    studentSchema,
    StudentSchema,
} from "@/lib/formValidationSchemas";
import {
    createParent,
    createStudent,
    updateParent,
    updateStudent,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const ParentForm = ({
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
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });

    const [img, setImg] = useState<any>();

    const [state, formAction, pending] = useActionState(
        type === "create" ? createParent : updateParent,
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
            toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state]);

    const { students } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new parent" : "Update the parent"}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
                Authentication Information
            </span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>

            <span className="text-xs text-gray-400 font-medium">
                Personal Information
            </span>

            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="First name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Last name"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
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
                    <label className="text-xs text-gray-500">Students</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("students")}
                        defaultValue={data?.students}
                    >
                        {students.map((student: { id: number; name: string }) => (
                            <option value={student.id} key={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    {errors.students?.message && (
                        <p className="text-xs text-red-400">
                            {errors.students.message.toString()}
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

export default ParentForm;
