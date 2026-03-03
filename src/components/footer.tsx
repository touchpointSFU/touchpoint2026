import Image from "next/image";
import circleInnovation from "@/assets/Circle-Innovation-RGB-Horiz-Reverse.svg?url";

export default function Footer() {
  return (
    <footer className="z-1 px-margin py-4 w-full">
      <div className="mx-auto w-full max-w-container flex flex-col md:flex-row gap-4 items-center text-body justify-between">
        <a
          href="https://2025.touchpointsfu.ca"
          className="max-md:order-1 text-base uppercase"
        >
          2025 site
        </a>
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
      </div>
    </footer>
  );
}
