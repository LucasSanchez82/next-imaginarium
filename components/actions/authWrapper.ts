import { authOptions } from "@/lib/auth";
import { Session, getServerSession } from "next-auth";

export const authWrapper = async (fn: (arg: Session | null) => any) => {
    const session = await getServerSession(authOptions);
    return fn(session);
}