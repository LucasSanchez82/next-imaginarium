import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const authWrapper = async <T extends Function> (fn: T) => {
    const session = await getServerSession(authOptions);
    if(session?.user) {
        return fn();
    }else{
        console.error('AuthWrapper : Erreur, l\'utilisateur doit etre connecte');
        throw new Error('Erreur, l\'utilisateur doit etre connecte');
    }
}