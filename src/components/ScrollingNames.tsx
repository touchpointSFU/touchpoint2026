type ScrollingNamesProps = {
  direction: "left" | "right";
};

export default function ScrollingNames({ direction }: ScrollingNamesProps) {
  const companies = [
    "Google",
    "Microsoft",
    "Electronic Arts",
    "Monday Creative",
    "Cause+Affect",
    "London Borough of Hounslow",
  ];

  const wordColor =
    direction === "right" ? "text-theme-green" : "text-theme-pink";

  const slashColor =
    direction === "right" ? "text-theme-pink" : "text-theme-green";

  return (
    <div className="w-full relative ">
      <div className="absolute flex justify-between w-full h-full z-30  ">
        <div className="h-full w-[10%] bg-linear-to-r from-[#0A0A0A] to-transparent"/>
        <div className="h-full  w-[10%] bg-linear-to-l from-[#0A0A0A] to-transparent"/>

        </div>
      <div
        className={`flex w-fit ${
          direction === "right"
            ? "animate-marquee"
            : direction === "left"
            ? "animate-marquee-right"
            : ""
        }`}
      >
        {[...companies, ...companies].map((c, i) => (
          <div
            key={i}
            className={`whitespace-nowrap px-4 leading-[115%] text-base font-Haas font-medium text-display ${wordColor}`}
          >
            {c} <span className={slashColor}>/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
