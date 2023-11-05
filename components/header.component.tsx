"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";

const Header = () => {
  const { data: session } = useSession();
  console.log(session);

  const user = session?.user;

  return (
    <header className="h-20">
      <nav className="h-full flex justify-between container items-center ">
        <div className="flex flex-row justify-between  w-2/4">
          <div>
            <ModeToggle />
          </div>
          <div>
            <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
              Imaginarium
            </Link>
          </div>
        </div>
        <ul className="flex items-center gap-4 ">
          <li>
            <Link href="/" className="text-ct-dark-600">
              Home
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link href="/login" className="text-ct-dark-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-ct-dark-600">
                  Register
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link href="/profile" className="text-ct-dark-600">
                  Profile
                </Link>
              </li>
              <li className="cursor-pointer" onClick={() => signOut()}>
                Logout
              </li>
              {user.isAdmin && (
                <li>
                  <Link href="/register" className="text-ct-dark-600">
                    register
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
