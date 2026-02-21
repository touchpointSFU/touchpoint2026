import Image from "next/image";
import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg";

export default function Footer() {
  return (
    <footer className="z-1 p-4 flex text-body flex-col lg:flex-row justify-between w-full">
      <time className="text-white  " dateTime="2026-03-21">
        03.21.2026
      </time>
      <address className="not-italic ">SFU Surrey Engineering Building</address>
      <a
        className="flex items-center gap-4 md:flex-row "
        href="https://circleinnovation.ca/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="text-base">In partnership with</span>

        <Image
          className="max-w-30 md:max-w-40"
          src={circleInnovation}
          alt="Logo: Circle Innovation"
        />
      </a>
    </footer>
  );
}
