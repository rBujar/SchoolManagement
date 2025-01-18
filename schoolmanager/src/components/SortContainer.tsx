"use client"

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


interface sortButtonProps{
    initialSortOrder: "asc" | "desc"
}

const SortContainer: React.FC<sortButtonProps> = ({initialSortOrder}) => {
    const searchParams = useSearchParams();
    const router = useRouter();


    const currentSortOrder = searchParams.get("sortOrder") || initialSortOrder;


    const toggleSortOrder = () => {
        const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";

        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set("sortOrder", newSortOrder);

        router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
    }



  return (
    <button onClick={toggleSortOrder} className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
        <Image src={currentSortOrder === "asc" ? "/sort-asc.png" : "/sort-desc.png"} alt="" width={14} height={14} />
    </button>
  );
};

export default SortContainer;