import clsx from "clsx";
import { useLenis } from "lenis/react";
import { i } from "motion/react-client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavIcon } from "./NavIcon";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";

export const Nav = ({ theme, page }: { theme: string; page: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState(page);
  const lenis = useLenis();

  useEffect(() => {
    setTab(page);
  }, [page]);

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

  const [background, setBackground] = useState(
    theme ? `var(--theme-${theme})` : "var(--background)",
  );

  useEffect(() => {
    // animate(background, theme ? `var(--theme-${theme})` : "var(--background)", {
    //   duration: 1,
    // });
    setBackground(theme ? `var(--theme-${theme})` : "var(--background)");
  }, [theme]);

  // useMotionValueEvent(background, "change", (latest) => {
  //   console.log("Background color changed to:", latest);
  // });

  return (
    <nav
      className={clsx(
        theme && !isOpen ? "text-background" : "text-foreground",
        "top-0 left-0 w-full z-50 pl-margin md:px-margin h-(--nav-height) flex items-center",
      )}
      style={{
        position: page === "/" ? "fixed" : "sticky",
        background: page === "/" ? "transparent" : background,
      }}
      // style={{
      //   background: background,
      // }}
      key="nav"
    >
      <div className="max-w-container mx-auto w-full flex items-center">
        <Link
          href="/"
          className="hover:opacity-75 focus:opacity-75 active:opacity-50 font-bold uppercase z-10"
          onClick={handleClick}
        >
          Touchpoint&apos;26
        </Link>
        <div
          data-active={isOpen ? "" : undefined}
          className={clsx(
            "ml-auto max-md:h-[calc(100dvh)] top-0 left-0 max-md:w-full max-md:fixed  max-md:flex-col justify-end max-md:py-8 px-4 max-md:bg-background/90  max-md:transition-discrete max-md:data-active:flex  max-md:hidden",
          )}
        >
          <h2 className="text-base font-bold  mb-4 md:hidden uppercase">
            Menu
          </h2>
          <ul className={clsx("flex -mx-4 max-md:flex-col")}>
            {[
              { name: "Home", href: "/", desktop: false },
              { name: "About", href: "/about", desktop: true },
              { name: "Speakers", href: "/speakers", desktop: true },
              { name: "Mentorship", href: "/mentorship", desktop: true },
            ].map((item, index) => (
              <li
                key={index}
                className="py-3 px-4 max-md:border-t border-theme-pink relative"
              >
                <Link
                  href={item.href}
                  onClick={handleClick}
                  onMouseOver={() => {
                    setTab(item.href);
                  }}
                  onMouseOut={() => {
                    setTab(page);
                  }}
                  onFocus={() => {
                    setTab(item.href);
                  }}
                  onBlur={() => {
                    setTab(page);
                  }}
                  className={clsx(
                    "active:opacity-50 flex text-lg md:text-base font-bold leading-none ",
                    !item.desktop && "md:hidden",
                  )}
                >
                  {item.name}
                  {tab === item.href && (
                    <span
                      className="max-md:hidden absolute size-[0.5em] top-1/2 left-0 -translate-y-1/2"
                      style={{
                        background: theme
                          ? "var(--background)"
                          : `var(--foreground)`,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
            <li>
              <a
                className={clsx(
                  theme
                    ? `bg-background text-foreground`
                    : "bg-theme-pink text-foreground",
                  "transition-transform ease-in-out hover:scale-105 focus:scale-110 active:scale-95 max-md:bg-theme-pink max-md:text-foreground py-3 px-4 block text-lg md:text-base font-bold leading-none",
                )}
                href="https://www.eventbrite.ca/e/1981807024158?aff=oddtdtcreator"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get tickets
              </a>
            </li>
          </ul>
        </div>
        <button
          className="md:hidden relative ml-auto size-12 transition-transform hover:scale-110 focus:scale-110 active:scale-95 z-50 flex items-center justify-center cursor-pointer"
          onClick={toggleMenu}
        >
          <NavIcon isOpen={isOpen} theme={theme} />
        </button>
      </div>
    </nav>
  );
};
