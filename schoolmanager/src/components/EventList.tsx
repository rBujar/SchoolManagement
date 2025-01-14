import prisma from "@/lib/prisma";

const parseDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split("/").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day); // Month is zero-based
};

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const date = dateParam ? parseDate(dateParam) : new Date();
    if (!date || isNaN(date.getTime())) {
        throw new Error("Invalid date parameter provided");
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    return data.map((event) => (
        <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
            key={event.id}
        >
            <div className="flex items-center justify-between">
                <h1 className="semi-bold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">
                    {new Date(event.startTime).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </span>
            </div>
            <p className="mt-2 text-gray-400">{event.description}</p>
        </div>
    ));
};

export default EventList;
