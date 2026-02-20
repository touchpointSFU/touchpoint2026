import clsx from "clsx";
import { useLenis } from "lenis/react";
import { i } from "motion/react-client";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { NavIcon } from "./NavIcon";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) lenis?.stop();
    else lenis?.start();
  };

  const handleClick = () => {
    lenis?.start();
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      lenis?.start();
      setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-background flex items-center px-margin">
      <Link
        href="/"
        className="text-white hover:text-gray-300 font-bold uppercase z-10"
      >
        Touchpoint&apos;26
      </Link>

      <div
        className={clsx(
          "ml-auto max-md:h-[calc(100dvh)] top-0 left-0 max-md:w-full max-md:fixed flex max-md:flex-col justify-end max-md:py-8 px-4 bg-blue-500/80",
          isOpen ? "max-md:opacity-100" : "max-md:opacity-0",
        )}
      >
        <h2 className="text-base font-bold text-white mb-4 md:hidden uppercase">
          Menu
        </h2>
        <ul className={clsx("flex -mx-4 max-md:flex-col bg-blue-500/80")}>
          {[
            { name: "Home", href: "/" },
            { name: "Test", href: "/test" },
            { name: "Schedule", href: "/schedule" },
          ].map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={handleClick}
                className="text-white hover:text-gray-300 py-3 px-4 block text-lg max-md:border-t border-theme-pink md:text-base font-bold"
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <a
              className="bg-theme-pink text-white hover:text-gray-300 py-3 px-4 block text-lg md:text-base font-bold"
              href="https://www.eventbrite.ca/e/1981807024158?aff=oddtdtcreator"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get tickets
            </a>
          </li>
          {/*
                <Link href="/schedule" className="text-white hover:text-gray-300">
                  Schedule
                </Link> */}
        </ul>
      </div>

      <button
        className="md:hidden relative ml-auto size-12 z-50 flex items-center justify-center cursor-pointer"
        onClick={toggleMenu}
      >
        <NavIcon isOpen={isOpen} />
      </button>
    </nav>
  );
};
