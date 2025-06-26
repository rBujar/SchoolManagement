import Image from "next/image";
import prisma from "@/lib/prisma";
import AttendanceChart from "./AttendanceChart";

const AttendanceChartContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(today);

    lastMonday.setDate(today.getDate() - daysSinceMonday);

    const resData = await prisma.attendance.findMany({
        where: { date: { gte: lastMonday } },
        select: { date: true, present: true },
    });


    const daysOfWeek = ["Hën", "Mar", "Mër", "Enj", "Pre"]

    const attendanceMap : {[key:string]:{present:number,absent:number}} = {
        Hën: {present:0, absent:0},
        Mar: {present:0, absent:0},
        Mër: {present:0, absent:0},
        Enj: {present:0, absent:0},
        Pre: {present:0, absent:0},
    }

    resData.forEach(item=>{
        const itemDate = new Date(item.date)
        const itemDay = itemDate.getDay(); 
        const dayName = daysOfWeek[itemDay - 1];

    //     if(dayName){
    //         const dayName = daysOfWeek[dayOfWeek - 1];

    //         if(item.present){
    //             attendanceMap[dayName].present += 1;
    //         }else{
    //             attendanceMap[dayName].absent += 1;
    //         }
    //     }
    // })
    if (dayName) {
        if (item.present) {
            attendanceMap[dayName].present += 1;
        } else {
            attendanceMap[dayName].absent += 1;
        }
    }
});

   const data = daysOfWeek.map((day)=>({
    name:day,
    present:attendanceMap[day].present,
    absent:attendanceMap[day].absent,
   }))

    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Vijushmëria</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} className="" />
            </div>
            <AttendanceChart data={data}/>
        </div>
    );
};

export default AttendanceChartContainer;
