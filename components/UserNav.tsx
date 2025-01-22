import { signOut } from 'next-auth/react';
import Link from 'next/link';

const UserNav = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="flex-between w-full pt-3 z-50">
      {/* Logo */}
      <Link className="flex gap-2 ml-4 flex-center" href="/">
        <p className="logo_text_black">Inzider</p>
      </Link>

      {/* Desktop View - Sign out button */}
      <div className="sm:flex hidden">
        <button
          type="button"
          onClick={handleSignOut}
          className="black_round_btn"
        >
          Sign Out
        </button>
      </div>

      {/* Mobile View - Sign out button */}
      <div className="sm:hidden flex relative">
        <button
          type="button"
          onClick={handleSignOut}
          className="black_round_mobile_btn"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default UserNav;
