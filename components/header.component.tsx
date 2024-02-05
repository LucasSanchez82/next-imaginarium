"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";

const Header = () => {
  const { data: session } = useSession();
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
              Accueil
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link href="/se-connecter" className="text-ct-dark-600">
                  Se connecter
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link href="/profile" className="text-ct-dark-600">
                  Profil
                </Link>
              </li>
              <li className="cursor-pointer" onClick={() => signOut()}>
                Se deconnecter
              </li>
              {user.isAdmin && (
                <>
                  <li>
                    <Link href="/creer-compte" className="text-ct-dark-600">
                      Creer compte
                    </Link>
                  </li>
                  <li>
                    <Link href="/comptes" className="text-ct-dark-600">
                      comptes
                    </Link>
                  </li>
                  <li>
                    <Link href="/enfants" className="text-ct-dark-600">
                      enfants
                    </Link>
                  </li>
                  <li>
                    <Link href="/categorie" className="text-ct-dark-600">
                      categorie
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
