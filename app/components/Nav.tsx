import { useEffect, useState } from 'react';
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
} from 'next-auth/react';

interface NavProps {
  onNavigate: (page: string) => void;
  isWhiteText: boolean;
}

const Nav: React.FC<NavProps> = ({ onNavigate, isWhiteText }) => {
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
      {/* Logo button */}
      <button
        onClick={() => onNavigate('start')}
        className="flex gap-2 ml-4 flex-center"
      >
        <p className={isWhiteText ? 'logo_text' : 'logo_text_black'}>Inzider</p>
      </button>

      {/* Desktop View - Show sign-in/out buttons or profile */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            {/* Action buttons for authenticated users */}
            <button
              onClick={() => onNavigate('create-category')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create Trip
            </button>
            <button
              onClick={() => onNavigate('create-quiz')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create GoTo
            </button>
            {/* Sign out button */}
            <button
              type="button"
              onClick={handleSignOut}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign Out
            </button>
            {/* Profile image - navigation to profile */}
            <button onClick={() => onNavigate('profile')}>
              <img
                src={session.user.image as string}
                width={37}
                height={37}
                className="rounded-full mr-5"
                alt="profile"
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-row">
            <button
              type="button"
              onClick={() => onNavigate('SigninForm')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onNavigate('SignupForm')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create Account
            </button>
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
                <button
                  onClick={() => {
                    setToggleDropdown(false);
                    onNavigate('profile-page');
                  }}
                  className="dropdown_link"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setToggleDropdown(false);
                    onNavigate('create-prompt');
                  }}
                  className="dropdown_link"
                >
                  Create Trip
                </button>
                <button
                  onClick={() => {
                    setToggleDropdown(false);
                    onNavigate('create-category');
                  }}
                  className="dropdown_link"
                >
                  Create GoTo
                </button>
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
            <button
              type="button"
              onClick={() => onNavigate('SigninForm')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onNavigate('SignupForm')}
              className={isWhiteText ? 'white_round_btn' : 'black_round_btn'}
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
