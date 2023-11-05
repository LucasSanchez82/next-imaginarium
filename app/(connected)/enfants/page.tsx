import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Enfant() {
  const session = await getServerSession(authOptions);
  console.log(session);
  
  if (!session) {
    redirect('/');
  } else {
    return (
      <>
        <h2>enfants page</h2>
      </>
    );
  }
}
