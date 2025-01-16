
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import Notes from "@/components/Notes";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {

  const {userId} = await auth();

  const classItem = await prisma.class.findMany({
    where:{
      students:{
        some:{
          id: userId!
        }
      }
    }
  });


  return(
    <div className='p-4 flex gap-4 flex-col xl:flex-row'>
      {/* LEFT */}
      <div className="w-full xl:2/3">
      <div className="h-full bg-white p4 rounded-md">
        <h1 className="text-xl font-semibold">Schedule (4A)</h1>
        <BigCalendarContainer  type="classId" id={classItem[0].id}/>
      </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8" >
        <EventCalendar />
        <Announcements />
        <div className=" flex justify-center items-center overflow-auto bg-white shadow-md rounded-lg p-4 h-[400px]"  >
        <Notes />
        </div>
      </div>

    </div>
  );
};

export default StudentPage;