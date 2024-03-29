import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SheetChangePassword } from "./sheetChangePassword";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  } else {
    const user = session.user;

    return (
      <>
        <section className="bg-ct-blue-600  min-h-screen pt-20 flex justify-between">
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
            <div>
              <p className="mb-3 text-5xl text-center font-semibold">
                Profile Page
              </p>
              {!user ? (
                <p>Loading...</p>
              ) : (
                <div className="flex items-center gap-8">
                  <div>
                    <img
                      src={user.image ? user.image : "/images/default.png"}
                      className="max-h-36"
                      alt={`profile photo of ${user.name}`}
                    />
                  </div>
                  <div className="mt-8">
                    <p className="mb-3">Name: {user.name}</p>
                    <p className="mb-3">Email: {user.email}</p>
                  </div>
                  <SheetChangePassword />
                </div>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
}
