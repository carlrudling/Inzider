import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
} from 'next-auth/react';

interface NavProps {
  isWhiteText: boolean;
}

const Nav: React.FC<NavProps> = ({ isWhiteText }) => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // Fetch the authentication providers like Google
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="flex-between w-full mb-16 pt-3 z-50 mt-4">
      {/* Logo */}
      <Link className="flex gap-2 ml-4 flex-center" href="/">
        <p className={isWhiteText ? 'logo_text' : 'logo_text_black'}>Inzider</p>
      </Link>

      {/* Desktop View - Show sign-in/out buttons or profile */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            {/* Sign out button */}
            <button
              type="button"
              onClick={handleSignOut}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign Out
            </button>
            {/* Profile image - navigation to profile */}
            <Link href="/profile">
              <img
                src={session.user.image as string}
                width={37}
                height={37}
                className="rounded-full mr-5"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <div className="flex flex-row">
            <Link
              href="/signin"
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Mobile View - Toggle dropdown for authenticated users */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <img
              src={session.user.image as string}
              width={37}
              height={37}
              className="rounded-full mr-3"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link href="/profile">
                  <a
                    onClick={() => setToggleDropdown(false)}
                    className="dropdown_link"
                  >
                    My Profile
                  </a>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    handleSignOut();
                  }}
                  className={
                    isWhiteText ? 'white_round_btn' : 'black_round_btn'
                  }
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-row">
            <Link
              href="/signin"
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
