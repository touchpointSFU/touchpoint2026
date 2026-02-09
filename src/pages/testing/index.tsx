import ScrollingNames from "@/components/ScrollingNames";
import Footer from "@/components/footer";

export default function Testing() {
  return (
    <div className="min-h-dvh flex flex-col overflow-hidden">
      <main className="flex flex-col flex-1">

        {/* headers and body copy */}
        <div className="flex flex-col justify-between lg:flex-row items-center md:items-start px-4 md:px-12 md:pt-12 pt-8">
          <hgroup className="text-center md:text-left">
            <h1 className="font-display mb-2 leading-[100%] font-light text-display text-theme-pink">
              Touchpoint 2026
            </h1>
            <h2 className="font-display mb-6 text-heading leading-[1.2em]  text-theme-green">
              Alternative Modes of Design,<br></br> Rooted in Community
            </h2>
          </hgroup>

          <a
            className="bg-background border-2 border-theme-pink text-theme-pink
                       focus:bg-theme-pink focus:text-background
                       hover:bg-theme-pink hover:text-background
                       leading-[1em] font-display font-semibold text-lg xl:text-4xl
                       px-8 py-2 h-fit w-fit "
            href="https://www.eventbrite.ca/e/1981807024158?aff=oddtdtcreator"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get tickets
          </a>
        </div>

        {/* Middle section (takes remaining space, centers marquee) */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center md:items-start w-full">
            <p className="text-description text-theme-green font-medium mb-2 md:pl-12">
              With speakers from
            </p>
            <ScrollingNames direction="right" />
            <ScrollingNames direction="left" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
