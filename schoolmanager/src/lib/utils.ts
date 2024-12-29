import { auth } from "@clerk/nextjs/server";

let role: string | null = null;
let currentUserId: string | null = null;


(async () => {
    const { userId, sessionClaims } = await auth();
    role = (sessionClaims?.metadata as { role?: string })?.role || null;
    currentUserId = userId || null;
})();

export { role, currentUserId };
