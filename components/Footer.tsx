'use client';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center py-16 bg-[#2E334A] text-center text-gray-800">
      <div className="sm:items-center sm:justify-between">
        <h2 className="self-center logo_text whitespace-nowrap dark:text-white mb-4">
          Inzider
        </h2>

        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <Link
              href="/user-agreement"
              className="hover:underline me-4 md:me-6"
            >
              User Agreement
            </Link>
          </li>
          <li>
            <Link
              href="/user-agreement"
              className="hover:underline me-4 md:me-6"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2025{' '}
        <a href="https://flowbite.com/" className="hover:underline">
          Inzider™
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
};

export default Footer;
