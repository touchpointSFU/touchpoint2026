import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-background">
      <ul className="flex space-x-4 p-4">
        <li>
          <Link href="/" className="text-white hover:text-gray-300 font-bold">
            Touchpoint 2026
          </Link>
        </li>
        <li>
          <Link href="/test" className="text-white hover:text-gray-300">
            Test
          </Link>
        </li>
        <li>
          <Link href="/schedule" className="text-white hover:text-gray-300">
            Schedule
          </Link>
        </li>
      </ul>
    </nav>
  );
};
